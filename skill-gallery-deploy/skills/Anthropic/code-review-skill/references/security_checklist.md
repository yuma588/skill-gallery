# 安全漏洞检查清单

本文档列出常见的安全漏洞模式，供代码审查时使用。

## 常见安全漏洞

### 1. SQL 注入 (SQL Injection)

**风险等级**: 🔴 严重

**描述**: 恶意用户可以通过输入参数操控 SQL 查询。

#### JavaScript/Node.js
```javascript
// ❌ 不安全 - 字符串拼接
const query = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ 安全 - 使用参数化查询
const query = 'SELECT * FROM users WHERE name = ?';
db.query(query, [userName]);
```

#### Python
```python
# ❌ 不安全 - 字符串格式化
query = f"SELECT * FROM users WHERE name = '{user_name}'"

# ✅ 安全 - 使用参数化查询
query = "SELECT * FROM users WHERE name = %s"
cursor.execute(query, (user_name,))
```

#### 检测方法
- 搜索字符串拼接的 SQL 查询
- 检查是否使用 ORM 或参数化查询
- 使用 Bandit/SQLMap 扫描

---

### 2. XSS 攻击 (Cross-Site Scripting)

**风险等级**: 🔴 严重

**描述**: 恶意脚本注入到网页中，盗取用户信息或进行恶意操作。

#### JavaScript/Node.js
```javascript
// ❌ 不安全 - 直接渲染用户输入
div.innerHTML = userInput;

// ✅ 安全 - 转义 HTML
div.textContent = userInput;
// 或使用 DOMPurify 等库
div.innerHTML = DOMPurify.sanitize(userInput);
```

#### Python (Flask/Jinja2)
```python
# ❌ 不安全 - 关闭自动转义
{{ user_input|safe }}

# ✅ 安全 - 默认自动转义
{{ user_input }}
```

#### 检测方法
- 检查 innerHTML 的使用
- 确认模板引擎的转义设置
- 使用 XSS Scanner 扫描

---

### 3. 硬编码敏感信息

**风险等级**: 🔴 严重

**描述**: 密钥、密码、API Token 等敏感信息直接写在代码中。

#### 代码示例
```javascript
// ❌ 不安全
const API_KEY = 'sk-1234567890abcdef';
const DB_PASSWORD = 'password123';

// ✅ 安全 - 使用环境变量
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

```python
# ❌ 不安全
API_KEY = "sk-1234567890abcdef"
DB_PASSWORD = "password123"

# ✅ 安全 - 使用环境变量
import os
API_KEY = os.environ.get('API_KEY')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
```

#### 检测方法
- 搜索 "password", "secret", "key", "token" 等关键字
- 使用 git-secrets 或 TruffleHog 扫描
- 检查 .gitignore 是否包含敏感文件

---

### 4. 不安全的随机数生成

**风险等级**: 🟡 警告

**描述**: 使用可预测的随机数生成器，可能导致安全问题。

#### JavaScript
```javascript
// ❌ 不安全 - Math.random() 不是密码安全的
const randomValue = Math.random();

// ✅ 安全 - 使用 crypto.randomBytes
const crypto = require('crypto');
const randomValue = crypto.randomBytes(32).toString('hex');
```

#### Python
```python
# ❌ 不安全 - random 模块不是密码安全的
import random
value = random.random()

# ✅ 安全 - 使用 secrets 模块
import secrets
value = secrets.token_hex(32)
```

#### 检测方法
- 检查随机数的使用场景
- 确认是否用于安全相关功能（令牌、密码等）

---

### 5. 命令注入 (Command Injection)

**风险等级**: 🔴 严重

**描述**: 用户输入直接用于系统命令执行。

#### JavaScript/Node.js
```javascript
// ❌ 不安全
const { exec } = require('child_process');
exec(`ls ${userInput}`, callback);

// ✅ 安全 - 使用参数化或白名单验证
const { spawn } = require('child_process');
const command = 'ls';
const args = [userInput];  // 已验证的输入
spawn(command, args);
```

#### Python
```python
# ❌ 不安全
import os
os.system(f"ls {user_input}")

# ✅ 安全 - 使用 subprocess 和参数化
import subprocess
subprocess.run(['ls', user_input], check=True)
```

#### 检测方法
- 检查 exec/system/popen 的使用
- 确认输入是否经过验证和转义

---

### 6. 路径遍历 (Path Traversal)

**风险等级**: 🔴 严重

**描述**: 恶意用户通过特殊路径符号访问系统文件。

#### JavaScript/Node.js
```javascript
// ❌ 不安全
const fs = require('fs');
const filePath = userPath;  // 可能是 "../../../etc/passwd"
fs.readFile(filePath, callback);

// ✅ 安全 - 验证和规范化路径
const path = require('path');
const filePath = path.normalize(userPath);
const basePath = '/app/uploads';
const resolvedPath = path.resolve(basePath, filePath);
if (!resolvedPath.startsWith(basePath)) {
    throw new Error('Invalid path');
}
fs.readFile(resolvedPath, callback);
```

#### Python
```python
# ❌ 不安全
import os
file_path = user_path  # 可能是 "../../../etc/passwd"
with open(file_path, 'r') as f:
    data = f.read()

# ✅ 安全 - 验证和规范化路径
import os
file_path = os.path.normpath(user_path)
base_path = '/app/uploads'
resolved_path = os.path.abspath(os.path.join(base_path, file_path))
if not resolved_path.startswith(base_path):
    raise ValueError('Invalid path')
with open(resolved_path, 'r') as f:
    data = f.read()
```

#### 检测方法
- 检查文件路径的构建
- 确认路径验证逻辑

---

### 7. 不安全的反序列化

**风险等级**: 🔴 严重

**描述**: 反序列化不可信数据可能导致远程代码执行。

#### Python
```python
# ❌ 不安全 - 使用 pickle
import pickle
data = pickle.loads(user_input)  # 可执行任意代码

# ✅ 安全 - 使用 JSON
import json
data = json.loads(user_input)  # 安全
```

#### 检测方法
- 检查 pickle、marshal 等不安全的序列化方式
- 使用 JSON 等安全格式

---

### 8. 不安全的加密算法

**风险等级**: 🔴 严重

**描述**: 使用过时或弱的加密算法。

#### JavaScript
```javascript
// ❌ 不安全
const crypto = require('crypto');
const cipher = crypto.createCipher('aes-128-ecb', key);

// ✅ 安全
const algorithm = 'aes-256-gcm';
const cipher = crypto.createCipheriv(algorithm, key, iv);
```

#### Python
```python
# ❌ 不安全
from Crypto.Cipher import AES
cipher = AES.new(key, AES.MODE_ECB)

# ✅ 安全
from Crypto.Cipher import AES
cipher = AES.new(key, AES.MODE_GCM)
```

#### 检测方法
- 检查加密算法的使用
- 确认使用现代、安全的算法（如 AES-256-GCM）

---

### 9. 不安全的 HTTPS 配置

**风险等级**: 🟡 警告

**描述**: HTTPS 证书验证不完整或配置不当。

#### Node.js
```javascript
// ❌ 不安全 - 禁用证书验证
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ✅ 安全 - 正确配置证书
const https = require('https');
const options = {
    cert: fs.readFileSync('server.crt'),
    key: fs.readFileSync('server.key'),
    ca: fs.readFileSync('ca.crt')
};
https.createServer(options, app).listen(443);
```

#### Python
```python
# ❌ 不安全 - 禁用证书验证
import requests
requests.get(url, verify=False)

# ✅ 安全 - 正确配置证书
import requests
requests.get(url, cert=('client.crt', 'client.key'))
```

---

### 10. 不安全的 Cookie 配置

**风险等级**: 🟡 警告

**描述**: Cookie 缺少安全属性，易被攻击者利用。

#### JavaScript/Express
```javascript
// ❌ 不安全
res.cookie('sessionId', session.id);

// ✅ 安全
res.cookie('sessionId', session.id, {
    httpOnly: true,      // 防止 XSS
    secure: true,        // 仅 HTTPS
    sameSite: 'strict',  // 防止 CSRF
    maxAge: 3600000
});
```

#### Python (Flask)
```python
# ❌ 不安全
response.set_cookie('sessionId', session_id)

# ✅ 安全
response.set_cookie('sessionId', session_id,
    httponly=True,
    secure=True,
    samesite='Strict',
    max_age=3600
)
```

---

## 安全审查检查项

### 数据验证
- [ ] 所有用户输入是否经过验证？
- [ ] 是否检查数据类型、长度、范围？
- [ ] 是否使用白名单而非黑名单？

### 认证和授权
- [ ] 密码是否使用强哈希（如 bcrypt、Argon2）？
- [ ] 是否有登录尝试限制？
- [ ] 敏感操作是否需要重新认证？
- [ ] API 是否有适当的认证和授权？

### 数据传输
- [ ] 是否使用 HTTPS？
- [ ] 敏感数据是否加密传输？
- [ ] 证书配置是否正确？

### 数据存储
- [ ] 敏感数据是否加密存储？
- [ ] 数据库访问是否使用最小权限原则？
- [ ] 是否有备份和恢复机制？

### 日志和监控
- [ ] 是否记录安全相关事件？
- [ ] 日志中是否包含敏感信息？
- [ ] 是否有异常检测机制？

### 依赖项
- [ ] 第三方库是否定期更新？
- [ ] 是否使用 npm audit / pip audit 扫描漏洞？
- [ ] 是否有依赖项锁定文件（package-lock.json）？

## 安全工具推荐

### JavaScript/TypeScript
- **ESLint**: 使用安全规则插件
- **npm audit**: 检测依赖项漏洞
- **Snyk**: 持续安全扫描
- **Retire.js**: 检测过时的 JavaScript 库

### Python
- **Bandit**: 安全漏洞扫描器
- **Pip-audit**: 依赖项安全审计
- **Safety**: 检测已知的安全漏洞
- **PyLint**: 包含安全规则

### 通用
- **OWASP ZAP**: Web 应用安全扫描
- **TruffleHog**: 扫描硬编码的密钥
- **GitLeaks**: 检测仓库中的敏感信息

## 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
