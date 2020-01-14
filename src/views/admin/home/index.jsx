import React from 'react'
import './index.less'

const Minions = () => (
  <div className='loading-wrapper' style={{ height: 600 }}>
    {/* <!-- 小黄人 --> */}
    <div className='minions'>
      {/* <!-- 身体 --> */}
      <div className='body'>
        {/* <!-- 裤子 --> */}
        <div className='trousers'>
          {/* <!-- 吊带 --> */}
          <div className='condole-belt'>
            <div className='left'></div>
            <div className='right'></div>
          </div>
          {/* <!-- 裤子突出的矩形部分 --> */}
          <div className='trousers-top'></div>
          {/* <!-- 裤袋 --> */}
          <div className='pocket'></div>
          {/* <!-- 三条线 --> */}
          <span className='line-left'></span>
          <span className='line-right'></span>
          <span className='line-bottom'></span>
        </div>
      </div>
      {/* <!-- 头发 --> */}
      <div className='hair'>
        <span className='left-hair-one'></span>
        <span className='left-hair-two'></span>
      </div>
      {/* <!-- 眼睛 --> */}
      <div className='eyes'>
        {/* <!-- 左眼 --> */}
        <div className='left-eye'>
          <div className='left-black-eye'>
            <div className='left-white'></div>
          </div>
        </div>
        {/* <!-- 右眼 --> */}
        <div className='right-eye'>
          <div className='right-black-eye'>
            <div className='right-white'></div>
          </div>
        </div>
      </div>
      {/* <!-- 嘴巴 --> */}
      <div className='mouse'>
        <div className='mouse-shape'></div>
      </div>
      {/* <!-- 双手 --> */}
      <div className='hands'>
        <div className='left-hand'></div>
        <div className='right-hand'></div>
      </div>
      {/* <!-- 双脚 --> */}
      <div className='feet'>
        <div className='left-foot'></div>
        <div className='right-foot'></div>
      </div>
      {/* <!-- 脚底阴影 --> */}
      <div className='ground-shadow'></div>
    </div>
  </div>
)

export default Minions
