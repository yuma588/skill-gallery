# 性能反模式识别

本文档列出常见的性能反模式和优化建议。

## 常见性能问题

### 1. N+1 查询问题

**性能影响**: 🔴 严重

**描述**: 在循环中执行数据库查询，导致大量重复查询。

#### JavaScript/TypeScript
```javascript
// ❌ 反模式
const users = await User.findAll();
for (const user of users) {
    user.posts = await Post.findAll({ where: { userId: user.id } });
    // 执行 N+1 次查询
}

// ✅ 优化 - 使用预加载
const users = await User.findAll({
    include: [{
        model: Post,
        as: 'posts'
    }]
});
// 只执行 2 次查询
```

#### Python (SQLAlchemy)
```python
# ❌ 反模式
users = User.query.all()
for user in users:
    user.posts = Post.query.filter_by(user_id=user.id).all()
    # 执行 N+1 次查询

# ✅ 优化 - 使用 eager loading
users = User.query.options(joinedload(User.posts)).all()
# 只执行 2 次查询
```

---

### 2. 未关闭的资源

**性能影响**: 🔴 严重

**描述**: 文件句柄、数据库连接等资源未正确关闭，导致资源泄漏。

#### JavaScript
```javascript
// ❌ 反模式
function processFile(filename) {
    const fs = require('fs');
    const file = fs.readFileSync(filename);
    // 可能忘记关闭文件
    return processData(file);
}

// ✅ 优化 - 使用流和自动关闭
async function processFile(filename) {
    const fs = require('fs');
    const stream = fs.createReadStream(filename);
    const data = await new Promise((resolve, reject) => {
        let buffer = '';
        stream.on('data', chunk => buffer += chunk);
        stream.on('end', () => resolve(buffer));
        stream.on('error', reject);
    });
    return processData(data);
}
```

#### Python
```python
# ❌ 反模式
def process_file(filename):
    f = open(filename, 'r')
    data = f.read()
    # 可能忘记关闭文件
    return process_data(data)

# ✅ 优化 - 使用上下文管理器
def process_file(filename):
    with open(filename, 'r') as f:
        data = f.read()
    return process_data(data)
```

---

### 3. 过深的循环嵌套

**性能影响**: 🔴 严重

**描述**: 多层嵌套循环导致时间复杂度呈指数增长（O(n³) 或更高）。

```javascript
// ❌ 反模式 - O(n³)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
            // 操作
        }
    }
}

// ✅ 优化 - 使用哈希表降低复杂度到 O(n²)
const map = new Map();
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        const key = `${i}-${j}`;
        if (!map.has(key)) {
            map.set(key, /* 计算 */);
        }
    }
}
```

---

### 4. 大对象在内存中保留

**性能影响**: 🟡 警告

**描述**: 不再需要的大对象未被及时释放，导致内存占用过高。

#### JavaScript
```javascript
// ❌ 反模式
let largeData = /* 大数据 */;
function process() {
    // 使用 largeData
}
process();
// largeData 仍在内存中

// ✅ 优化 - 及时释放
function processWithCleanup() {
    const largeData = /* 大数据 */;
    // 使用 largeData
    const result = /* 处理结果 */;
    return result;  // largeData 自动被回收
}
```

#### Python
```python
# ❌ 反模式
large_data = load_large_data()
def process():
    # 使用 large_data
    pass
process()
# large_data 仍在内存中

# ✅ 优化 - 使用函数作用域
def process_with_cleanup():
    large_data = load_large_data()
    result = process_data(large_data)
    del large_data  # 显式删除
    return result
```

---

### 5. 不必要的数据库查询

**性能影响**: 🟡 警告

**描述**: 在循环或频繁调用的函数中执行重复的数据库查询。

```javascript
// ❌ 反模式
async function getUserPreferences(userId) {
    const user = await User.findById(userId);
    const preferences = await Preferences.findById(user.preferencesId);
    return preferences;
}
// 每次调用都查询数据库

// ✅ 优化 - 使用缓存
const cache = new Map();
async function getUserPreferences(userId) {
    if (cache.has(userId)) {
        return cache.get(userId);
    }
    const user = await User.findById(userId);
    const preferences = await Preferences.findById(user.preferencesId);
    cache.set(userId, preferences);
    return preferences;
}
```

---

### 6. 同步阻塞操作

**性能影响**: 🔴 严重

**描述**: 在事件循环中执行同步阻塞操作，阻止其他请求处理。

#### JavaScript
```javascript
// ❌ 反模式
const fs = require('fs');
function processFile(filename) {
    const data = fs.readFileSync(filename);  // 阻塞事件循环
    return processData(data);
}

// ✅ 优化 - 使用异步 API
async function processFile(filename) {
    const data = await fs.promises.readFile(filename);
    return processData(data);
}
```

---

### 7. 字符串拼接效率低

**性能影响**: 🟡 警告

**描述**: 在循环中重复拼接字符串，导致频繁创建新字符串对象。

#### JavaScript
```javascript
// ❌ 反模式
let result = '';
for (let i = 0; i < 1000; i++) {
    result += data[i];  // 每次都创建新字符串
}

// ✅ 优化 - 使用数组
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push(data[i]);
}
const result = parts.join('');
```

#### Python
```python
# ❌ 反模式
result = ''
for item in data:
    result += item  # 每次都创建新字符串

# ✅ 优化 - 使用列表
parts = []
for item in data:
    parts.append(item)
result = ''.join(parts)
```

---

### 8. 不必要的数据复制

**性能影响**: 🟡 警告

**描述**: 不必要的深拷贝或数组复制导致额外的内存和CPU开销。

#### JavaScript
```javascript
// ❌ 反模式
const data = /* 大数组 */;
const copied = [...data];  // 不必要的复制
processData(copied);

// ✅ 优化 - 直接使用
const data = /* 大数组 */;
processData(data);
```

#### Python
```python
# ❌ 反模式
data = get_large_list()
copied = data.copy()  # 不必要的复制
process_data(copied)

# ✅ 优化 - 直接使用
data = get_large_list()
process_data(data)
```

---

### 9. 频繁的 DOM 操作

**性能影响**: 🟡 警告

**描述**: 在循环中频繁操作 DOM，导致页面重绘/重排。

```javascript
// ❌ 反模式
const list = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
    const item = document.createElement('div');
    item.textContent = `Item ${i}`;
    list.appendChild(item);  // 每次 DOM 操作都触发重绘
}

// ✅ 优化 - 使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const item = document.createElement('div');
    item.textContent = `Item ${i}`;
    fragment.appendChild(item);
}
document.getElementById('list').appendChild(fragment);  // 只触发一次重绘
```

---

### 10. 缺少索引优化

**性能影响**: 🔴 严重

**描述**: 数据库查询缺少合适的索引，导致全表扫描。

#### SQL 查询
```sql
-- ❌ 反模式
SELECT * FROM users WHERE email = 'user@example.com';
-- 如果 email 列没有索引，会全表扫描

-- ✅ 优化
CREATE INDEX idx_users_email ON users(email);
-- 查询使用索引，大幅提升性能
```

---

### 11. 大文件一次性加载

**性能影响**: 🔴 严重

**描述**: 将大文件一次性加载到内存中，导致内存溢出或性能下降。

#### JavaScript
```javascript
// ❌ 反模式
const fs = require('fs');
const data = fs.readFileSync('large_file.txt');  // 一次性加载
processData(data);

// ✅ 优化 - 使用流
const fs = require('fs');
const readStream = fs.createReadStream('large_file.txt');
readStream.on('data', (chunk) => {
    processData(chunk);  // 分块处理
});
```

#### Python
```python
# ❌ 反模式
with open('large_file.txt', 'r') as f:
    data = f.read()  # 一次性加载
    process_data(data)

# ✅ 优化 - 逐行读取
with open('large_file.txt', 'r') as f:
    for line in f:  # 逐行处理
        process_line(line)
```

---

### 12. 缺少缓存机制

**性能影响**: 🟡 警告

**描述**: 重复计算或请求相同的数据，没有使用缓存。

```javascript
// ❌ 反模式
function calculateExpensiveValue(input) {
    // 复杂计算
    return result;
}

// ✅ 优化 - 使用记忆化
const cache = new Map();
function calculateExpensiveValue(input) {
    if (cache.has(input)) {
        return cache.get(input);
    }
    const result = /* 复杂计算 */;
    cache.set(input, result);
    return result;
}
```

---

## 性能优化检查项

### 算法复杂度
- [ ] 时间复杂度是否合理？
- [ ] 空间复杂度是否可接受？
- [ ] 是否有不必要的嵌套循环？

### 数据库操作
- [ ] 是否有 N+1 查询问题？
- [ ] 查询是否有合适的索引？
- [ ] 是否使用预加载或批量操作？

### 内存管理
- [ ] 大对象是否及时释放？
- [ ] 是否有不必要的数据复制？
- [ ] 是否有内存泄漏风险？

### I/O 操作
- [ ] 是否使用异步非阻塞 I/O？
- [ ] 文件/网络操作是否优化？
- [ ] 大文件是否分块处理？

### 缓存策略
- [ ] 重复计算是否有缓存？
- [ ] 数据库查询是否有缓存？
- [ ] API 响应是否有缓存？

### 前端性能
- [ ] 是否有频繁的 DOM 操作？
- [ ] 是否使用文档片段或虚拟 DOM？
- [ ] 图片和资源是否优化？

## 性能分析工具推荐

### JavaScript/Node.js
- **Chrome DevTools**: 性能分析、内存分析
- **Node.js Profiler**: CPU 和内存分析
- **clinic.js**: 性能诊断工具套件
- **0x**: Flame graph 生成器

### Python
- **cProfile**: 内置性能分析器
- **timeit**: 小段代码计时
- **memory_profiler**: 内存分析
- **py-spy**: 采样分析器

### 数据库
- **EXPLAIN**: 查询执行计划分析
- **pg_stat_statements** (PostgreSQL): 查询统计
- **slow query log** (MySQL): 慢查询日志

### 通用
- **Apache Bench (ab)**: 压力测试
- **wrk**: HTTP 基准测试
- **JMeter**: 负载测试

## 性能优化最佳实践

1. **测量先行**: 在优化前先测量，确定瓶颈
2. **渐进优化**: 优先优化最影响性能的部分
3. **权衡考虑**: 性能 vs 可读性 vs 开发成本
4. **持续监控**: 优化后持续监控效果
5. **团队协作**: 与团队共享性能最佳实践

## 参考资源

- [High Performance Browser Networking](https://hpbn.co/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Python Performance Tips](https://wiki.python.org/moin/PythonSpeed/PerformanceTips)
- [Database Performance Tuning Guide](https://www.postgresql.org/docs/current/performance-tips.html)
