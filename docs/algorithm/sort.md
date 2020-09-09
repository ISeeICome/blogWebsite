# 排序算法

## 冒泡排序

冒泡排序（Bubble Sort）的基本思路是：每一次从待排序的数据元素中，依次比较相邻的两个元素，将比较小的数放在前面，比较大的数放在后面，直到比较到最后两个数。重复步骤，直到待排序的数据元素全部排完。

这个算法的名字又来是因为越大的元素会经由交换慢慢“浮”到数列的顶端（升序或降序排列），就如同碳酸饮料重的气泡会最终会上浮到顶端一样，故名“冒泡排序”。

```js
    const bubbleSort = （arr） => {
        for (let i = arr.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (arr[i] > arr[i + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        return arr;
    }

```

- 时间复杂度：O（n^2）
- 空间复杂度：O（1）

## 选择排序

选择排序（selection sort）的基本思路是：每一次从待排序的数据元素中选出最小（或最大）的一个元素，把这个元素存放在序列的起始位置，直到待排序的数据元素全部排完。

选择排序是不稳定的排序算法

```js
    const selectSort = (arr) => {
        for (let i = 0; i < arr.length; i++) {\
            const minIndex = 0;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            } 
            [arr[mindex], arr[i]] = [arr[i], arr[minIndex]];
        }
        return arr;
    }
```

## 快速排序

快速排序（QuickSort）又称为交换排序，简称快排。基本思路是：每一次从待排序的数据元素中找一个基准点，再建立两个数组left与right。left存储大于（或等于）基准点数，right存储小于（或等于）基准点的数据元素，利用递归依次继续比较left于right。

```js
    const quickSort = (arr) => {
        if (arr.length <= 1) return arr;
        let left = [];
        let right = [];
        const num = Math.floor(arr.length / 2);
        const numValue = arr.splice(num, 1)[0];
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] > numValue) {
                right.push(arr[i])
            } else {
                arr.push(arr[i])
            }
        }
        return [...quickSort(left), ...quickSosrt(right)]
    }
```

## 插入排序

插入排序（insertion sort）。基本思路是：通过构建有序序列（把第一个元素默认是已排序的元素），对于未排序的数据，在已排序序列中从后向前扫描，找到相应位置并插入。

插入排序在实现上，通常采用in-place排序（即只需用到O（1）的额外空间的排序）。因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

```js
    const insertSort = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            const preIndex = i - 1;
            const current = arr[i];
            while (preIndex >= 0 && arr[preIndex] > current) {
                arr[preIndex + 1] = arr[PreIndex];
                preIndex--;
            }
            arr[preIndex + 1] =current 
        }
        return arr;
    }
```