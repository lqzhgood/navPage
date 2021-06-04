/*global Vue DATA */
Vue.config.devtools = true;
new Vue({
    el: '#app',
    created() {
        let favList = localStorage.favList;
        if (favList) {
            favList = JSON.parse(favList);
            this.list.Favorite.list = favList.filter(v => {
                return v.isFavorite;
            });
        }
    },
    data: {
        list: DATA,
    },
    computed: {
        typeList() {
            let favList = this.list.Favorite.list;
            let arr = Object.keys(this.list);
            if (favList.length > 0) {
                return arr;
            } else {
                arr.splice(
                    arr.findIndex(type => type === 'Favorite'),
                    1,
                );
                return arr;
            }
        },
    },
    watch: {
        list: {
            handler(val, oldVal) {
                localStorage.favList = JSON.stringify(val.Favorite.list);
            },
            deep: true,
        },
    },
    methods: {
        fav(ov) {
            ov.isFavorite = !ov.isFavorite;
            let favList = this.list.Favorite.list;
            if (ov.isFavorite) {
                favList.push(ov);
            } else {
                favList.forEach((rV, index) => {
                    if (rV.id == ov.id) {
                        favList.splice(index, 1);
                    }
                });
            }
        },
        op($event, item) {
            let path = $event.path.map(v => {
                return v.className;
            });
            if (item.disabled) return;
            if (path.includes('bar')) {
                return;
            }
            window.open(item.url);
        },
        scrollTo(id) {
            this.animateScroll('blockWrap', id, 30);
        },
        animateScroll(felmId, elmId, speed) {
            let felm = document.getElementById(felmId);
            let elm = document.getElementById(elmId);
            // let rect = elm.getBoundingClientRect();
            //获取元素相对窗口的top值，此处应加上窗口本身的偏移
            // let top = window.pageYOffset + rect.top;
            let top = elm.offsetTop;
            let currentTop = felm.scrollTop;
            let requestId;
            if (top > currentTop) {
                window.requestAnimationFrame(stepAdd);
            } else {
                window.requestAnimationFrame(stepSub);
            }
            //采用requestAnimationFrame，平滑动画
            function stepAdd(timestamp) {
                currentTop += speed;
                if (currentTop <= top) {
                    felm.scrollTo(0, currentTop);
                    requestId = window.requestAnimationFrame(stepAdd);
                } else {
                    felm.scrollTo(0, top);
                    window.cancelAnimationFrame(requestId);
                }
            }

            function stepSub(timestamp) {
                currentTop -= speed;
                if (currentTop >= top) {
                    felm.scrollTo(0, currentTop);
                    requestId = window.requestAnimationFrame(stepSub);
                } else {
                    felm.scrollTo(0, top);
                    window.cancelAnimationFrame(requestId);
                }
                console.log('currentTop', currentTop);
            }
        },
    },
});
