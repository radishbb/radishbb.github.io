document.addEventListener('DOMContentLoaded', () => {
    // 1. 实现滚动时内容缓缓升起的优雅动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.section, .video-frame, .hero');
    items.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 1s cubic-bezier(0.2, 0.8, 0.2, 1)";
        observer.observe(el);
    });

    // 2. 视频点击模拟 (用于演示)
    const videoPlaceholder = document.querySelector('.video-placeholder');
    videoPlaceholder.addEventListener('click', () => {
        // 这里可以替换为动态插入 iframe 的逻辑
        alert("此处接入视频播放器 API");
    });
});


function playVideo(event) {
    const video = document.getElementById('main-video');
    const container = document.querySelector('.video-container');

    // 关键点：如果点击的是视频原生的控制条（controls），则不执行逻辑
    // 防止控制条操作与容器点击事件冲突
    if (event && event.target !== container && event.target !== document.getElementById('video-cover')) {
        return; 
    }

    if (video.paused) {
        video.play();
        container.classList.add('is-playing');
        video.controls = true; 
    } else {
        video.pause();
        container.classList.remove('is-playing');
        // 暂停时可以视需求决定是否隐藏进度条，通常建议保留以方便拖动
    }
}

// 核心：监听视频原生的暂停/播放状态，同步 UI 状态
// 这样无论用户是点屏幕中间，还是点左下角的小暂停键，效果都一致
const mainVid = document.getElementById('main-video');
const videoContainer = document.querySelector('.video-container');

mainVid.addEventListener('play', () => {
    videoContainer.classList.add('is-playing');
    mainVid.controls = true;
});

mainVid.addEventListener('pause', () => {
    videoContainer.classList.remove('is-playing');
});

mainVid.onended = function() {
    videoContainer.classList.remove('is-playing');
    this.controls = false;
};

const scrollContainer = document.querySelector('.video-scroll-container');

scrollContainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    // 将垂直滚动转换为横向滚动
    scrollContainer.scrollLeft += evt.deltaY;
});

// 增加拖拽滑动功能
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollContainer.style.cursor = 'grabbing';
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    scrollContainer.style.cursor = 'grab';
});

scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    scrollContainer.style.cursor = 'grab';
});

scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度
    scrollContainer.scrollLeft = scrollLeft - walk;
});



