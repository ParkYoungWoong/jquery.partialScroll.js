# Partail Scroll JS

## Installation

### Step 1

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="js/jquery.partialScroll.js"></script>
```

### Step 2

```html
<div class="partialscroll">
    <div class="section"></div>
    <div class="section"></div>
    <div class="section"></div>
    <div class="section"></div>
</div>
```

### Step 3

```js
$(document).ready(function () {
  $('.partialscroll').partialScroll();
});
```

## Options

### General

#### `secWidth`

섹션의 가로 너비

```
default: 0
options: INTEGER
```

#### `secHeight`

섹션의 세로 너비

```
default: 0
options: INTEGER
```

#### `secLength`

섹션의 개수

```
default: 0
options: INTEGER
```

#### `scrollingSpeed`

섹션의 속도

```
default: 700
options: INTEGER
```

#### `throttleScrolling`

스크롤 체크 속도

```
default: 100
options: INTEGER
```

### Callbacks

#### `sliderBefore`

스크롤 슬라이드 직전

```
default: function () {}
options: function (oldIndex, newIndex) {}
arguments:
  oldIndex: 슬라이드 이전 페이지 번호
  newIndex: 슬라이드 이후 페이지 번호
```

#### `sliderAfter`

스크롤 슬라이드 직후

```
default: function () {}
options: function (oldIndex, newIndex) {}
arguments:
  oldIndex: 슬라이드 이전 페이지 번호
  newIndex: 슬라이드 다음 페이지 번호
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

스크롤 정지 (모든 스크롤 메소드 사용 불가능)

```js
var slider = $('partialscroll').partialScroll();
slider.stopScroll();
```

#### `startScroll`

스크롤 시작 (모든 스크롤 메소드 사용 가능)

```js
var slider = $('partialscroll').partialScroll();
slider.startScroll();
```