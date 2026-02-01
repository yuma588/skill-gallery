<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
      <div class="skeleton-footer">
        <div class="skeleton-price"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-card {
  @include card-style;
  overflow: hidden;

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg,
      var(--light-gray) 25%,
      #f5f5f5 50%,
      var(--light-gray) 75%
    );
    background-size: 200% 100%;
    animation: loading-pulse 1.5s infinite;
  }

  .skeleton-content {
    padding: var(--spacing-lg);
  }

  .skeleton-title {
    height: 24px;
    width: 80%;
    margin-bottom: var(--spacing-md);
    background: linear-gradient(90deg,
      var(--light-gray) 25%,
      #f5f5f5 50%,
      var(--light-gray) 75%
    );
    background-size: 200% 100%;
    animation: loading-pulse 1.5s infinite;
    border-radius: var(--radius-sm);
  }

  .skeleton-text {
    height: 16px;
    width: 100%;
    margin-bottom: var(--spacing-sm);
    background: linear-gradient(90deg,
      var(--light-gray) 25%,
      #f5f5f5 50%,
      var(--light-gray) 75%
    );
    background-size: 200% 100%;
    animation: loading-pulse 1.5s infinite;
    border-radius: var(--radius-sm);

    &.short {
      width: 60%;
    }
  }

  .skeleton-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-lg);
  }

  .skeleton-price {
    height: 24px;
    width: 80px;
    background: linear-gradient(90deg,
      var(--light-gray) 25%,
      #f5f5f5 50%,
      var(--light-gray) 75%
    );
    background-size: 200% 100%;
    animation: loading-pulse 1.5s infinite;
    border-radius: var(--radius-sm);
  }

  .skeleton-button {
    height: 36px;
    width: 100px;
    background: linear-gradient(90deg,
      var(--light-gray) 25%,
      #f5f5f5 50%,
      var(--light-gray) 75%
    );
    background-size: 200% 100%;
    animation: loading-pulse 1.5s infinite;
    border-radius: var(--radius-md);
  }
}

@keyframes loading-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
