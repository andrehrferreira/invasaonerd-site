<template>
    <div id="loading">
        <div id="loading-wrapper">
            <div id="loading-text">CARREGANDO..</div>
            <div id="loading-content"></div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
#loading {
    position: fixed;
    top: 0;
    bottom: 0%;
    left: 0;
    right: 0%;
    background-color: #202020;
    z-index: 99;
}

#loading-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}

#loading-text {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    color: #999;
    width: 100px;
    height: 30px;
    margin: -7px 0 0 -45px;
    text-align: center;
    font-family: 'PT Sans Narrow', sans-serif;
    font-size: 14px;
}

#loading-content {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 170px;
    height: 170px;
    margin: -85px 0 0 -85px;
    border: 3px solid #f00;
}

#loading-content:before {
    content: '';
    position: absolute;
    border: 3px solid #00f;
    left: 5px;
    right: 5px;
    top: 5px;
    bottom: 5px;
}

#loading-content {
    border: 6px solid transparent;
    border-top-color: #85a2b6;
    border-bottom-color: #85a2b6;
    border-radius: 50%;
    -webkit-animation: loader 1s linear infinite;
    -moz-animation: loader 1s linear infinite;
    -o-animation: loader 1s linear infinite;
    animation: loader 1s linear infinite;
}

#loading-content:before {
    border: 6px solid transparent;
    border-top-color: #fdfdfd;
    border-bottom-color: #fdfdfd;
    border-radius: 50%;
    -webkit-animation: loader 2s linear infinite;
    -moz-animation: loader 1s linear infinite;
    -o-animation: loader 1s linear infinite;
    animation: loader 2s linear infinite;
}

@-webkit-keyframes loaders {
    0% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }

    100% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}

@keyframes loader {
    0% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }

    100% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}

#content-wrapper {
    color: #fff;
    position: fixed;
    left: 0;
    top: 20px;
    width: 100%;
    height: 100%;
}

#header {
    width: 800px;
    margin: 0 auto;
    text-align: center;
    height: 100px;
    background-color: #666;
}

#content {
    width: 800px;
    height: 1000px;
    margin: 0 auto;
    text-align: center;
    background-color: #888;
}
</style>
