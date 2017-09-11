function _getWrapperElement(htmlStr) {
    var str = htmlStr.match(/(?:^<([A-Za-z]+)>.*<\/([A-Za-z]+)>$)|(?:^<([A-Za-z]+)>[^\/]*\/>$)/);
    if ((str.length === 3 && str[1] === str[2]) || str.length === 2 ) {

    }
}

var Widget = {
    mount: function(ele, index) {
        if (ele && (ele.nodeType === 9 || ele.nodeType === 1)) {
            this.parentNode = ele;
            let html = this.render();

            // mount dom
            if (index && ele.children.length && index !== ele.children.length) {

            } else {
                ele.appendChild();
            }
        }
    }
};

export default Widget;