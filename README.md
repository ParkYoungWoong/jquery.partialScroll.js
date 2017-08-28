# Partial Scroll JS

## Installation

### Step 1

Link the required files.

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="js/jquery.partialScroll.js"></script>
```

### Step 2

Creating HTML.

```html
<div class="partialscroll">
    <div class="section"></div>
    <div class="section"></div>
    <div class="section"></div>
    <div class="section"></div>
</div>
```

### Step 3

Creating CSS.

```css
html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.partialscroll {
    width: 1920px;
    height: 980px;
}
```

### Step 4

Call the `partialScroll` method.

```js
$(document).ready(function () {
  $('.partialscroll').partialScroll();
});
```

## Options

### General

```js
$('.partialscroll').partialScroll({
  secWidth: 0,  // INTEGER / 스크롤 영역의 가로 너비
  secHeight: 0,  // INTEGER / 스크롤 영역의 세로 너비
  secLength: 0,  // INTEGER / 섹션의 개수
  scrollingSpeed: 900,  // INTEGER / 섹션 속도
  throttleScrolling: 100,  // INTEGER / 스크롤 체크 속도
  footer: false,  // BOOLEAN / FOOTER 사용 유무
  sliderBefore: function (oldIndex, newIndex) {  },  // 슬라이드 직전 
  sliderAfter: function (oldIndex, newIndex) {  }  // 슬라이드 직후
});
```

### Public methods

#### `moveTo`

원하는 섹션으로 이동 (zero-based)

```js
var slider = $('partialscroll').partialScroll();
slider.moveTo(3);  // 2번째 페이지로 이동
```

#### `moveToUp`

바로 위 섹션으로 이동

```js
var slider = $('partialscroll').partialScroll();
slider.moveToUp();
```

#### `moveToDown`

바로 아래 섹션으로 이동

```js
var slider = $('partialscroll').partialScroll();
slider.moveToDown();
```

#### `stopScroll`

스크롤 정지 

> 모든 스크롤 메소드를 사용할 수 없습니다.

```js
var slider = $('partialscroll').partialScroll();
slider.stopScroll();
```

#### `startScroll`

스크롤 시작 

> 모든 스크롤 메소드를 사용 가능합니다.

```js
var slider = $('partialscroll').partialScroll();
slider.startScroll();
```
