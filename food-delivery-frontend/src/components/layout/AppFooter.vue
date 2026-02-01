<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="logo">
            <el-icon :size="28" color="#FF6B35">
              <Food />
            </el-icon>
            <span class="logo-text">Gourmet Velocity</span>
          </div>
          <p class="brand-description">
            美味与速度的完美结合，为您带来极致的外卖点餐体验。
          </p>
        </div>

        <!-- Links -->
        <div class="footer-links">
          <div class="link-section">
            <h4 class="link-title">关于我们</h4>
            <a href="#" class="link">品牌故事</a>
            <a href="#" class="link">加入我们</a>
            <a href="#" class="link">媒体报道</a>
          </div>
          <div class="link-section">
            <h4 class="link-title">帮助中心</h4>
            <a href="#" class="link">常见问题</a>
            <a href="#" class="link">联系客服</a>
            <a href="#" class="link">意见反馈</a>
          </div>
          <div class="link-section">
            <h4 class="link-title">合作商家</h4>
            <a href="#" class="link">商家入驻</a>
            <a href="#" class="link">推广合作</a>
            <a href="#" class="link">广告投放</a>
          </div>
        </div>

        <!-- Contact -->
        <div class="footer-contact">
          <h4 class="contact-title">联系我们</h4>
          <div class="contact-item">
            <el-icon><Phone /></el-icon>
            <span>400-888-8888</span>
          </div>
          <div class="contact-item">
            <el-icon><Message /></el-icon>
            <span>support@gourmetvelocity.com</span>
          </div>
          <div class="contact-item">
            <el-icon><Location /></el-icon>
            <span>北京市朝阳区美食大厦</span>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p>&copy; 2024 Gourmet Velocity. All rights reserved.</p>
        <div class="bottom-links">
          <a href="#" class="bottom-link">隐私政策</a>
          <a href="#" class="bottom-link">服务条款</a>
          <a href="#" class="bottom-link">Cookie 政策</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Food, Phone, Message, Location } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.app-footer {
  background: var(--dark-gray);
  color: var(--white);
  padding: var(--spacing-3xl) 0 var(--spacing-lg);
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-brand {
  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  .logo-text {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-orange);
  }

  .brand-description {
    color: var(--medium-gray);
    line-height: 1.8;
  }
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.link-section {
  .link-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--white);
  }

  .link {
    display: block;
    color: var(--medium-gray);
    text-decoration: none;
    margin-bottom: var(--spacing-sm);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--primary-orange);
    }
  }
}

.footer-contact {
  .contact-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--white);
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--medium-gray);
    margin-bottom: var(--spacing-md);

    .el-icon {
      color: var(--primary-orange);
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--medium-gray);

  .bottom-links {
    display: flex;
    gap: var(--spacing-lg);

    .bottom-link {
      color: var(--medium-gray);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--primary-orange);
      }
    }
  }
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .footer-links {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-links {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style>
