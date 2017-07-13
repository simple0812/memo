import Vue from 'vue'
import Footex from './footex.vue';

describe('index', () => {
   // 检查mount中的组件实例
  it('correctly sets the title when created', () => {
    const vm = new Vue(Footex).$mount()
    expect(vm.title).toBe('simple0812@sina.cn')
  })
  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    const Ctor = Vue.extend(Footex)
    const vm = new Ctor().$mount()
    expect(vm.$el.querySelector('#loginNav').textContent).toBe('simple0812@sina.cn')
  })
});