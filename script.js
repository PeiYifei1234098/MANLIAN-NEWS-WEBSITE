// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 合作信息页筛选功能
  if (document.getElementById('collab-list')) {
    initCollaborationFilters();
  }
  
  // 手办展示页筛选功能
  if (document.getElementById('figure-list')) {
    initFigureFilters();
  }
  
  // 社区留言功能
  if (document.getElementById('comments-container')) {
    initCommunityFeatures();
  }
});

// 合作信息筛选初始化
function initCollaborationFilters() {
  const searchInput = document.getElementById('collab-search');
  const searchBtn = document.getElementById('collab-search-btn');
  const typeFilter = document.getElementById('collab-type');
  const merchantFilter = document.getElementById('merchant-type');
  const timeFilter = document.getElementById('time-range');
  const collabItems = document.querySelectorAll('.collab-item');
  
  // 筛选函数
  function filterCollaborations() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedMerchant = merchantFilter.value;
    
    collabItems.forEach(item => {
      const title = item.querySelector('.card-title').textContent.toLowerCase();
      const desc = item.querySelector('.card-desc').textContent.toLowerCase();
      const itemType = item.getAttribute('data-type');
      const itemMerchant = item.getAttribute('data-merchant');
      
      // 检查是否匹配所有筛选条件
      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesType = selectedType === 'all' || itemType === selectedType;
      const matchesMerchant = selectedMerchant === 'all' || itemMerchant === selectedMerchant;
      
      // 显示或隐藏项目
      if (matchesSearch && matchesType && matchesMerchant) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  // 绑定筛选事件
  searchBtn.addEventListener('click', filterCollaborations);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') filterCollaborations();
  });
  typeFilter.addEventListener('change', filterCollaborations);
  merchantFilter.addEventListener('change', filterCollaborations);
  timeFilter.addEventListener('change', filterCollaborations);
}

// 手办筛选初始化
function initFigureFilters() {
  const searchInput = document.getElementById('figure-search');
  const searchBtn = document.getElementById('figure-search-btn');
  const seriesFilter = document.getElementById('anime-series');
  const priceFilter = document.getElementById('price-range');
  const sizeFilter = document.getElementById('size-spec');
  const figureItems = document.querySelectorAll('.figure-item');
  
  // 筛选函数
  function filterFigures() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSeries = seriesFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedSize = sizeFilter.value;
    
    figureItems.forEach(item => {
      const title = item.querySelector('.card-title').textContent.toLowerCase();
      const desc = item.querySelector('.card-desc').textContent.toLowerCase();
      const itemSeries = item.getAttribute('data-series');
      const itemPrice = parseFloat(item.getAttribute('data-price'));
      const itemSize = item.getAttribute('data-size');
      
      // 检查是否匹配所有筛选条件
      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesSeries = selectedSeries === 'all' || itemSeries === selectedSeries;
      
      // 价格筛选
      let matchesPrice = true;
      if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(Number);
        if (selectedPrice === '0-500') {
          matchesPrice = itemPrice <= 500;
        } else if (selectedPrice === '500-1000') {
          matchesPrice = itemPrice > 500 && itemPrice <= 1000;
        } else if (selectedPrice === '1000-2000') {
          matchesPrice = itemPrice > 1000 && itemPrice <= 2000;
        } else if (selectedPrice === '2000+') {
          matchesPrice = itemPrice > 2000;
        }
      }
      
      const matchesSize = selectedSize === 'all' || itemSize === selectedSize;
      
      // 显示或隐藏项目
      if (matchesSearch && matchesSeries && matchesPrice && matchesSize) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  // 绑定筛选事件
  searchBtn.addEventListener('click', filterFigures);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') filterFigures();
  });
  seriesFilter.addEventListener('change', filterFigures);
  priceFilter.addEventListener('change', filterFigures);
  sizeFilter.addEventListener('change', filterFigures);
}

// 社区功能初始化
function initCommunityFeatures() {
  const commentInput = document.getElementById('comment-input');
  const postBtn = document.getElementById('post-comment');
  const commentsContainer = document.getElementById('comments-container');
  const likeBtns = document.querySelectorAll('.like-btn');
  const collectBtns = document.querySelectorAll('.collect-btn');
  
  // 发布留言
  postBtn.addEventListener('click', function() {
    const commentText = commentInput.value.trim();
    if (!commentText) return;
    
    // 创建新留言元素
    const now = new Date();
    const dateString = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">Anonymous user</div>
        <div class="comment-time">${dateString}</div>
      </div>
      <div class="comment-content">
        ${commentText}
      </div>
      <div class="comment-actions">
        <div class="comment-action like-btn" data-id="${Date.now()}">
          <i class="far fa-heart"></i> Likes (0)
        </div>
        <div class="comment-action reply-btn">
          <i class="far fa-comment"></i> Reply
        </div>
        <div class="comment-action collect-btn">
          <i class="far fa-bookmark"></i> Favourites
        </div>
      </div>
    `;
    
    // 添加到留言列表顶部
    commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
    
    // 清空输入框
    commentInput.value = '';
    
    // 为新添加的按钮绑定事件
    bindCommentEvents(newComment);
  });
  
  // 绑定已有留言的事件
  likeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      const countText = this.textContent.trim();
      let count = parseInt(countText.match(/\d+/)[0]);
      
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-primary');
        this.innerHTML = `<i class="fas fa-heart text-primary"></i> Liked (${count + 1})`;
      } else {
        icon.classList.remove('fas', 'text-primary');
        icon.classList.add('far');
        this.innerHTML = `<i class="far fa-heart"></i> Likes (${count - 1})`;
      }
    });
  });
  
  // 收藏按钮事件
  collectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-primary');
        this.innerHTML = `<i class="fas fa-bookmark text-primary"></i> Favourited`;
      } else {
        icon.classList.remove('fas', 'text-primary');
        icon.classList.add('far');
        this.innerHTML = `<i class="far fa-bookmark"></i> Favourites`;
      }
    });
  });
  
  // 为新评论绑定事件的函数
  function bindCommentEvents(commentEl) {
    const likeBtn = commentEl.querySelector('.like-btn');
    const collectBtn = commentEl.querySelector('.collect-btn');
    
    likeBtn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      const countText = this.textContent.trim();
      let count = parseInt(countText.match(/\d+/)[0]);
      
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-primary');
        this.innerHTML = `<i class="fas fa-heart text-primary"></i> Liked (${count + 1})`;
      } else {
        icon.classList.remove('fas', 'text-primary');
        icon.classList.add('far');
        this.innerHTML = `<i class="far fa-heart"></i> Likes (${count - 1})`;
      }
    });
    
    collectBtn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-primary');
        this.innerHTML = `<i class="fas fa-bookmark text-primary"></i> Favorited`;
      } else {
        icon.classList.remove('fas', 'text-primary');
        icon.classList.add('far');
        this.innerHTML = `<i class="far fa-bookmark"></i> Favourite`;
      }
    });
  }
}