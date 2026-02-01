<template>
  <Layout>
    <div class="address-management-page">
      <div class="page-header">
        <h1 class="page-title">收货地址管理</h1>
        <el-button type="primary" :icon="Plus" @click="showAddDialog">
          添加新地址
        </el-button>
      </div>

      <!-- Address List -->
      <div v-loading="orderStore.loading" class="address-list">
        <div
          v-for="address in orderStore.addresses"
          :key="address.id"
          class="address-card"
          :class="{ default: address.isDefault }"
        >
          <div class="address-content">
            <div class="address-header">
              <h3 class="receiver-name">{{ address.receiverName }}</h3>
              <el-tag v-if="address.isDefault" type="primary" size="small">默认</el-tag>
            </div>
            <p class="receiver-phone">{{ address.receiverPhone }}</p>
            <p class="address-detail">
              {{ address.province }} {{ address.city }} {{ address.district }}
              {{ address.detailAddress }}
            </p>
          </div>
          <div class="address-actions">
            <el-button link @click="handleSetDefault(address)">
              {{ address.isDefault ? '已是默认' : '设为默认' }}
            </el-button>
            <el-button link type="primary" @click="showEditDialog(address)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(address)">
              删除
            </el-button>
          </div>
        </div>

        <EmptyState
          v-if="orderStore.addresses.length === 0 && !orderStore.loading"
          type="data"
          title="暂无收货地址"
          description="添加您的收货地址，方便快捷下单"
          action-text="添加地址"
          @action="showAddDialog"
        />
      </div>

      <!-- Add/Edit Dialog -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEditMode ? '编辑地址' : '添加新地址'"
        width="500px"
        @close="handleDialogClose"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="80px"
        >
          <el-form-item label="收货人" prop="receiverName">
            <el-input v-model="formData.receiverName" placeholder="请输入收货人姓名" />
          </el-form-item>

          <el-form-item label="手机号" prop="receiverPhone">
            <el-input v-model="formData.receiverPhone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="所在地区" prop="province">
            <el-cascader
              v-model="selectedRegion"
              :options="regionOptions"
              placeholder="请选择省/市/区"
              style="width: 100%"
              @change="handleRegionChange"
            />
          </el-form-item>

          <el-form-item label="详细地址" prop="detailAddress">
            <el-input
              v-model="formData.detailAddress"
              type="textarea"
              :rows="3"
              placeholder="请输入详细地址"
            />
          </el-form-item>

          <el-form-item label="设为默认">
            <el-switch v-model="formData.isDefault" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order.store'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import Layout from '@/components/layout/Layout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Address } from '@/types'

const orderStore = useOrderStore()

const dialogVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const editingAddressId = ref<string | null>(null)
const selectedRegion = ref<string[]>([])

const formData = reactive({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false
})

const regionOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '朝阳区',
        label: '朝阳区',
        children: [
          { value: '三里屯', label: '三里屯' },
          { value: '国贸', label: '国贸' }
        ]
      }
    ]
  }
]

const formRules: FormRules = {
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为 2-20 个字符', trigger: 'blur' }
  ],
  receiverPhone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 200, message: '地址长度为 5-200 个字符', trigger: 'blur' }
  ]
}

onMounted(async () => {
  await orderStore.fetchAddresses()
})

const showAddDialog = () => {
  isEditMode.value = false
  editingAddressId.value = null
  resetForm()
  dialogVisible.value = true
}

const showEditDialog = (address: Address) => {
  isEditMode.value = true
  editingAddressId.value = address.id
  Object.assign(formData, address)
  selectedRegion.value = [address.province, address.city, address.district]
  dialogVisible.value = true
}

const handleRegionChange = (value: string[]) => {
  if (value && value.length >= 3) {
    formData.province = value[0]
    formData.city = value[1]
    formData.district = value[2]
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    if (isEditMode.value && editingAddressId.value) {
      await orderStore.updateAddress(editingAddressId.value, formData)
      ElMessage.success('地址更新成功')
    } else {
      await orderStore.addAddress(formData)
      ElMessage.success('地址添加成功')
    }

    dialogVisible.value = false
    await orderStore.fetchAddresses()
  } catch (error) {
    console.error('操作失败', error)
    ElMessage.error(isEditMode.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

const handleSetDefault = async (address: Address) => {
  if (address.isDefault) return

  try {
    await orderStore.updateAddress(address.id, { isDefault: true })
    ElMessage.success('设置成功')
    await orderStore.fetchAddresses()
  } catch (error) {
    console.error('设置默认地址失败', error)
    ElMessage.error('设置失败')
  }
}

const handleDelete = async (address: Address) => {
  try {
    await ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await orderStore.deleteAddress(address.id)
    ElMessage.success('删除成功')
    await orderStore.fetchAddresses()
  } catch (error) {
    console.error('删除失败', error)
  }
}

const handleDialogClose = () => {
  resetForm()
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false
  })
  selectedRegion.value = []
}
</script>

<style lang="scss" scoped>
.address-management-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-gray);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 2px solid transparent;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &.default {
    border-color: var(--primary-orange);
    background: linear-gradient(135deg, #fff5f0 0%, var(--white) 100%);
  }
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.receiver-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-gray);
}

.receiver-phone {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-sm);
}

.address-detail {
  color: var(--dark-gray);
  line-height: 1.6;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  align-items: flex-end;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;

    .el-button {
      width: 100%;
    }
  }

  .address-card {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .address-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    border-top: 1px solid var(--light-gray);
    padding-top: var(--spacing-md);
  }
}
</style>
