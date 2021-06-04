/*global Vue DATA */
Vue.config.devtools = true;
new Vue({
    el: '#app',
    created() {
        let favList = localStorage.favList;
        try {
            favList = JSON.parse(favList);
            this.Favorite = favList;
        } catch (error) {
            localStorage.favList = '[]';
        }

        let count = 0;
        this.list = DATA.map(v => {
            v.list.forEach(l => {
                l.count = count;
                count++;

                if (favList.some(f => f.name == l.name)) {
                    l.isFavorite = true;
                }
            });
            return v;
        });
    },
    data: {
        list: [],
        Favorite: [],
    },
    computed: {
        all_list() {
            return (
                this.Favorite.length > 0
                    ? [
                          {
                              type: 'Favorite',
                              list: this.Favorite,
                          },
                      ]
                    : []
            ).concat(this.list);
        },
        typeList() {
            return this.list.map(v => v.type);
        },
    },
    watch: {
        Favorite(v) {
            localStorage.favList = JSON.stringify(v);
        },
    },
    methods: {
        fav(ov) {
            console.log('123', 123);
            ov.isFavorite = !ov.isFavorite;
            if (ov.isFavorite) {
                this.Favorite.push(ov);
            } else {
                this.Favorite.forEach((rV, index) => {
                    if (rV.name == ov.name) {
                        this.Favorite.splice(index, 1);
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
