# 数据清洗指南

本文档提供数据清洗的最佳实践和常见问题解决方案。

## 数据质量检查清单

### 完整性检查
- [ ] 缺失值比例是否合理（< 30%）？
- [ ] 是否存在关键数据缺失？
- [ ] 缺失值是否随机分布？

### 准确性检查
- [ ] 数值范围是否合理？
- [ ] 是否存在逻辑错误（如年龄 > 150）？
- [ ] 日期格式是否一致？

### 一致性检查
- [ ] 相同实体的命名是否统一？
- [ ] 单位是否一致？
- [ ] 分类值是否标准化？

### 唯一性检查
- [ ] 主键是否唯一？
- [ ] 是否存在重复记录？
- [ ] 重复数据是否合理？

## 缺失值处理

### 缺失值识别

#### 统计缺失值
```python
# 查看每列缺失值数量
missing_counts = df.isnull().sum()
missing_percentage = (missing_counts / len(df)) * 100

print("缺失值统计:")
for col, count, pct in zip(df.columns, missing_counts, missing_percentage):
    print(f"{col}: {count} ({pct:.1f}%)")
```

#### 可视化缺失值
```python
import seaborn as sns
import matplotlib.pyplot as plt

# 绘制缺失值热力图
sns.heatmap(df.isnull(), cbar=False, cmap='viridis')
plt.title('缺失值分布')
plt.show()
```

### 缺失值处理策略

#### 1. 删除法
**适用场景**:
- 缺失比例高（> 50%）
- 缺失非随机
- 样本量充足

```python
# 删除缺失比例高的列
threshold = 0.5
df_dropped = df.dropna(thresh=int(threshold * len(df)), axis=1)

# 删除包含缺失的行
df_rows = df.dropna()
```

#### 2. 填充法

**数值型数据**:
```python
# 均值填充
df['column'] = df['column'].fillna(df['column'].mean())

# 中位数填充（抗异常值）
df['column'] = df['column'].fillna(df['column'].median())

# 前向填充（时间序列）
df['column'] = df['column'].fillna(method='ffill')

# 线性插值
df['column'] = df['column'].interpolate(method='linear')
```

**分类型数据**:
```python
# 众数填充
mode_value = df['column'].mode()[0]
df['column'] = df['column'].fillna(mode_value)

# 指定填充
df['column'] = df['column'].fillna('未知')
```

**日期数据**:
```python
# 线性插值
df['date_column'] = pd.to_datetime(df['date_column'])
df['date_column'] = df['date_column'].interpolate(method='time')
```

#### 3. 标记法
```python
# 标记缺失值
df['column_missing'] = df['column'].isnull()
df['column'] = df['column'].fillna(0)

# 分析时考虑缺失标记
```

### 处理建议

| 缺失比例 | 推荐方法 | 理由 |
|---------|---------|------|
| < 5% | 删除或均值填充 | 影响小，简单 |
| 5%-30% | 插值或预测填充 | 保留信息，减少偏差 |
| > 30% | 删除列或专业填充 | 信息不足，风险高 |

## 异常值处理

### 异常值检测方法

#### 1. 统计方法

**Z-score方法**:
```python
from scipy import stats

z_scores = np.abs(stats.zscore(df['column']))
threshold = 3
outliers = df[z_scores > threshold]
```

**IQR方法**:
```python
Q1 = df['column'].quantile(0.25)
Q3 = df['column'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['column'] < lower_bound) | (df['column'] > upper_bound)]
```

#### 2. 可视化方法

**箱线图**:
```python
import matplotlib.pyplot as plt

plt.boxplot(df['column'])
plt.title('箱线图 - 异常值检测')
plt.show()
```

**散点图**:
```python
plt.scatter(df.index, df['column'])
plt.axhline(upper_bound, color='r', linestyle='--')
plt.axhline(lower_bound, color='r', linestyle='--')
plt.show()
```

### 异常值处理策略

#### 1. 删除法
```python
# 删除超出范围的值
df_cleaned = df[(df['column'] >= lower_bound) &
                (df['column'] <= upper_bound)]
```

#### 2. 修正法
```python
# 缩放到边界
df['column'] = df['column'].clip(lower_bound, upper_bound)
```

#### 3. 标记法
```python
# 标记异常值
df['column_outlier'] = False
df.loc[outliers.index, 'column_outlier'] = True
```

#### 4. 分析法
```python
# 分离分析
normal_data = df[~df['column_outlier']]
outlier_data = df[df['column_outlier']]

# 对比分析
print(f"正常值均值: {normal_data['column'].mean()}")
print(f"异常值均值: {outlier_data['column'].mean()}")
```

### 处理建议

| 异常类型 | 推荐方法 | 场景 |
|---------|---------|------|
| 数据录入错误 | 删除或修正 | 明显的输入错误 |
| 真实极端值 | 标记或保留 | 极端但合理的数据 |
| 测量误差 | 修正或插值 | 仪器误差 |
| 系统性偏差 | 调查根因 | 需要业务理解 |

## 重复值处理

### 重复值检测
```python
# 查找完全重复的行
duplicates = df.duplicated()
print(f"重复行数: {duplicates.sum()}")

# 查找部分重复的行（基于特定列）
key_columns = ['id', 'date']
duplicates = df.duplicated(subset=key_columns, keep=False)
```

### 重复值处理

#### 1. 删除重复
```python
# 保留第一个
df_unique = df.drop_duplicates(keep='first')

# 保留最后一个
df_unique = df.drop_duplicates(keep='last')

# 删除所有重复
df_unique = df.drop_duplicates(keep=False)
```

#### 2. 聚合
```python
# 按键分组聚合
df_agg = df.groupby(key_columns).agg({
    'value': 'sum',
    'count': 'count'
}).reset_index()
```

## 数据类型转换

### 数值转换

#### 标准化
```python
# Min-Max标准化
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
df['column_normalized'] = scaler.fit_transform(df[['column']])
```

#### Z-score标准化
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df['column_standardized'] = scaler.fit_transform(df[['column']])
```

### 日期转换

#### 解析日期
```python
# 常见日期格式解析
date_formats = ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y']

for fmt in date_formats:
    try:
        df['date'] = pd.to_datetime(df['date'], format=fmt)
        break
    except:
        continue
```

#### 提取时间特征
```python
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day'] = df['date'].dt.day
df['day_of_week'] = df['date'].dt.dayofweek
df['quarter'] = df['date'].dt.quarter
```

### 文本转换

#### 大小写统一
```python
df['text_column'] = df['text_column'].str.lower()
# 或
df['text_column'] = df['text_column'].str.upper()
```

#### 去除空格
```python
df['text_column'] = df['text_column'].str.strip()
```

#### 替换文本
```python
df['text_column'] = df['text_column'].str.replace('旧值', '新值')
```

## 数据标准化

### 列名标准化
```python
# 统一命名规范
df.columns = df.columns.str.strip()           # 去除空格
df.columns = df.columns.str.lower()            # 小写
df.columns = df.columns.str.replace(' ', '_')    # 空格转下划线
```

### 单位统一
```python
# 统一货币单位
df['amount'] = df['amount'].apply(
    lambda x: x * 1000 if unit == '万' else x
)

# 统一时间单位
df['time'] = df['time'].apply(
    lambda x: x * 60 if unit == '小时' else x
)
```

### 分类值标准化
```python
# 统一分类值
value_mapping = {
    '男': 'Male',
    'M': 'Male',
    'female': 'Female',
    'F': 'Female'
}
df['gender'] = df['gender'].map(value_mapping)

# 小类别合并
category_mapping = {
    'A类': '高端',
    'B类': '高端',
    'C类': '中端',
    'D类': '中端',
    '其他': '其他'
}
df['category'] = df['category'].map(category_mapping)
```

## 数据验证

### 范围验证
```python
# 检查数值范围
def check_range(df, column, min_val, max_val):
    out_of_range = df[(df[column] < min_val) | (df[column] > max_val)]
    if len(out_of_range) > 0:
        print(f"警告: {column} 超出范围 [{min_val}, {max_val}]")
        print(out_of_range)

# 使用示例
check_range(df, 'age', 0, 120)
check_range(df, 'score', 0, 100)
```

### 逻辑验证
```python
# 检查逻辑关系
# 销售额不能小于0
invalid_sales = df[df['sales'] < 0]

# 结束日期不能早于开始日期
invalid_dates = df[df['end_date'] < df['start_date']]

# 折扣不能超过价格
invalid_discount = df[df['discount'] > df['price']]
```

### 唯一性验证
```python
# 检查主键唯一性
duplicated_ids = df[df['id'].duplicated()]
if len(duplicated_ids) > 0:
    print(f"发现 {len(duplicated_ids)} 个重复ID")

# 检查组合键唯一性
duplicated_keys = df.duplicated(subset=['id', 'date'])
```

## 数据清洗工作流

### 推荐流程

```
1. 初步检查
   ├── 加载数据
   ├── 查看数据形状
   ├── 查看数据类型
   └── 查看缺失值统计

2. 质量评估
   ├── 缺失值分析
   ├── 异常值检测
   ├── 重复值检查
   └── 数据类型检查

3. 数据清洗
   ├── 处理缺失值
   ├── 处理异常值
   ├── 删除重复值
   └── 转换数据类型

4. 数据标准化
   ├── 列名标准化
   ├── 单位统一
   └── 分类值标准化

5. 验证
   ├── 范围验证
   ├── 逻辑验证
   └── 唯一性验证

6. 文档记录
   ├── 记录清洗步骤
   ├── 记录修改原因
   └── 记录数据质量指标
```

### 自动化脚本模板

```python
def clean_data(df):
    """
    数据清洗函数
    """
    print("开始数据清洗...")

    # 1. 处理缺失值
    print(f"  - 缺失值: {df.isnull().sum().sum()}")
    df = fill_missing_values(df)

    # 2. 处理异常值
    print(f"  - 异常值: {detect_outliers(df)}")
    df = handle_outliers(df)

    # 3. 删除重复
    duplicates = df.duplicated().sum()
    print(f"  - 重复行: {duplicates}")
    df = df.drop_duplicates()

    # 4. 数据类型转换
    df = convert_data_types(df)

    # 5. 数据验证
    validate_data(df)

    print("数据清洗完成！")
    return df

def clean_pipeline(input_file, output_file):
    """
    清洗流水线
    """
    # 加载
    df = pd.read_excel(input_file)

    # 清洗
    df_cleaned = clean_data(df)

    # 保存
    df_cleaned.to_excel(output_file, index=False)

    # 生成报告
    generate_cleaning_report(df, df_cleaned)
```

## 常见问题

### Q: 如何决定使用哪种缺失值填充方法？

A: 决策依据：
- 随机缺失（MCAR）→ 均值/中位数
- 有规律缺失（MAR）→ 插值/预测
- 大量缺失（> 30%）→ 删除或专业方法

### Q: 异常值应该删除还是保留？

A: 取决于原因：
- 明显错误 → 删除或修正
- 真实极端 → 标记后保留分析
- 不确定 → 标记后分组对比

### Q: 如何记录数据清洗过程？

A:
1. 创建清洗日志：记录每步操作
2. 保存中间结果：便于追溯
3. 对比清洗前后指标：量化效果
4. 编写文档：说明决策理由

### Q: 如何处理混合数据类型列？

A:
- 统一为字符串，然后转换
- 使用pd.to_numeric(errors='coerce')
- 分别处理后再合并
