# 代码质量检查清单

本文档提供代码审查时的质量检查标准和阈值。

## 指标阈值

### 圈复杂度 (Cyclomatic Complexity)

| 等级 | 复杂度范围 | 建议 |
|------|-----------|------|
| 优秀 | 1-10 | 无需修改 |
| 良好 | 11-20 | 可接受，建议优化 |
| 需改进 | 21-50 | 应重构 |
| 严重 | >50 | 必须重构 |

### 函数长度

| 等级 | 行数范围 | 建议 |
|------|---------|------|
| 优秀 | 1-20 | 理想状态 |
| 良好 | 21-50 | 可接受 |
| 需改进 | 51-100 | 建议拆分 |
| 严重 | >100 | 必须拆分 |

### 文件长度

| 等级 | 行数范围 | 建议 |
|------|---------|------|
| 优秀 | 1-200 | 理想状态 |
| 良好 | 201-500 | 可接受 |
| 需改进 | 501-1000 | 建议拆分模块 |
| 严重 | >1000 | 必须拆分模块 |

### 重复代码

| 等级 | 重复率 | 建议 |
|------|--------|------|
| 优秀 | 0-3% | 无需修改 |
| 良好 | 4-10% | 可接受 |
| 需改进 | 11-20% | 建议提取公共方法 |
| 严重 | >20% | 必须重构 |

## 代码质量标准

### 命名规范

#### JavaScript/TypeScript
- **变量和函数**: 小驼峰命名法 (camelCase)
- **类**: 大驼峰命名法 (PascalCase)
- **常量**: 全大写 + 下划线 (UPPER_SNAKE_CASE)
- **私有成员**: 前缀下划线 (_privateField)

```javascript
// ✅ 好的命名
const userName = 'John';
function calculateTotal() {}
class UserProfile {}
const MAX_CONNECTIONS = 100;
const _privateVar = null;

// ❌ 不好的命名
const User_Name = 'John';
function CalculateTotal() {}
class user_profile {}
const maxConnections = 100;
```

#### Python
- **变量和函数**: 小写 + 下划线 (snake_case)
- **类**: 大驼峰命名法 (PascalCase)
- **常量**: 全大写 + 下划线 (UPPER_SNAKE_CASE)
- **私有成员**: 前缀双下划线 (__private)

```python
# ✅ 好的命名
user_name = 'John'
def calculate_total():
    pass

class UserProfile:
    pass

MAX_CONNECTIONS = 100
__private_var = None

# ❌ 不好的命名
userName = 'John'
def CalculateTotal():
    pass

class user_profile:
    pass

maxConnections = 100
```

### 注释标准

#### 必须添加注释的情况
1. **复杂算法**: 解释算法思路和复杂度
2. **业务规则**: 说明特定业务逻辑的原因
3. **临时解决方案**: 标记 TODO/FIXME 并说明原因
4. **性能优化**: 说明优化前的性能问题和优化后的效果

#### 注释规范
- 使用清晰、简洁的语言
- 注释应该解释"为什么"而不是"是什么"
- 保持注释与代码同步更新

```javascript
// ✅ 好的注释
// 使用二分查找提高性能，时间复杂度从 O(n) 降低到 O(log n)
function findElement(sortedArray, target) {
    // ...
}

// ❌ 不好的注释
// 定义一个查找函数
function findElement(array, target) {
    // ...
}
```

### 错误处理

#### JavaScript/TypeScript
- 使用 try-catch 处理可能的异常
- 提供有意义的错误信息
- 避免吞掉错误

```javascript
// ✅ 好的错误处理
try {
    const data = await fetchAPI(url);
    return processData(data);
} catch (error) {
    console.error('获取数据失败:', error.message);
    throw new Error(`无法处理 ${url} 的数据: ${error.message}`);
}

// ❌ 不好的错误处理
try {
    const data = await fetchAPI(url);
    return processData(data);
} catch (error) {
    // 静默失败
}
```

#### Python
- 使用 try-except 处理特定异常
- 提供详细的错误信息
- 避免使用裸 except

```python
# ✅ 好的错误处理
try:
    with open(filename, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    raise FileNotFoundError(f"文件不存在: {filename}")
except json.JSONDecodeError as e:
    raise ValueError(f"JSON 解析失败: {e}")

# ❌ 不好的错误处理
try:
    with open(filename, 'r') as f:
        data = json.load(f)
except:
    pass  # 静默失败
```

### 资源管理

#### 文件和连接
- 使用 using/with 语句自动管理资源
- 确保在异常情况下也能正确释放资源

```javascript
// ✅ 好的资源管理
async function processFile(filename) {
    let fileHandle;
    try {
        fileHandle = await fs.promises.open(filename, 'r');
        const data = await fileHandle.readFile();
        return processData(data);
    } finally {
        if (fileHandle) await fileHandle.close();
    }
}

// ❌ 不好的资源管理
async function processFile(filename) {
    const fileHandle = await fs.promises.open(filename, 'r');
    const data = await fileHandle.readFile();
    // 可能忘记关闭文件句柄
    return processData(data);
}
```

```python
# ✅ 好的资源管理
def process_file(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return process_data(data)

# ❌ 不好的资源管理
def process_file(filename):
    f = open(filename, 'r')
    data = json.load(f)
    # 可能忘记关闭文件
    return process_data(data)
```

## 设计原则

### SOLID 原则

1. **单一职责原则 (SRP)**: 一个类或函数应该只有一个改变的理由
2. **开闭原则 (OCP)**: 对扩展开放，对修改关闭
3. **里氏替换原则 (LSP)**: 子类应该可以替换父类
4. **接口隔离原则 (ISP)**: 不应该强迫依赖不使用的方法
5. **依赖倒置原则 (DIP)**: 依赖抽象而不是具体实现

### DRY 原则 (Don't Repeat Yourself)

- 重复的代码应该提取为函数或类
- 相同的逻辑应该统一实现

### KISS 原则 (Keep It Simple, Stupid)

- 优先选择简单的解决方案
- 避免不必要的复杂性

## 代码审查检查项

### 功能性
- [ ] 代码是否实现了预期的功能？
- [ ] 边界条件是否正确处理？
- [ ] 错误处理是否完善？
- [ ] 是否有资源泄漏的风险？

### 可读性
- [ ] 命名是否清晰、有意义？
- [ ] 复杂逻辑是否有注释说明？
- [ ] 代码结构是否清晰、易理解？
- [ ] 是否遵循团队的编码规范？

### 可维护性
- [ ] 代码是否易于修改？
- [ ] 是否有过度耦合？
- [ ] 是否有重复代码？
- [ ] 是否易于测试？

### 性能
- [ ] 算法复杂度是否合理？
- [ ] 是否有不必要的计算？
- [ ] 是否有内存泄漏风险？
- [ ] 数据库查询是否优化？

### 安全性
- [ ] 是否有 SQL 注入风险？
- [ ] 是否有 XSS 攻击风险？
- [ ] 是否有硬编码的敏感信息？
- [ ] 输入验证是否完善？

## 常见反模式

### Magic Numbers
```javascript
// ❌ 不好
if (x > 100) { ... }

// ✅ 好
const MAX_ITEMS = 100;
if (x > MAX_ITEMS) { ... }
```

### 嵌套过深
```javascript
// ❌ 不好
if (condition1) {
    if (condition2) {
        if (condition3) {
            doSomething();
        }
    }
}

// ✅ 好
if (condition1 && condition2 && condition3) {
    doSomething();
}
```

### 过长的参数列表
```javascript
// ❌ 不好
function createUser(name, email, age, address, phone, country, city, zipcode) { ... }

// ✅ 好
function createUser({ name, email, age, address, phone, country, city, zipcode }) { ... }
```

## 参考资源

- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [JavaScript Standard Style](https://standardjs.com/)
- [PEP 8 -- Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/)
