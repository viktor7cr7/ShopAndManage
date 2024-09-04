import React from 'react'
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StateItem from './StateItem';

const StatsContainer = ({totalQuantity}) => {
  const state = [
    {
        title: 'Всего товаров продано',
        count: totalQuantity || 0,
        icon: <FaSuitcaseRolling></FaSuitcaseRolling>,
        color: '#f59e0b',
        bcg: '#fef3c7'
    },
  ]
  return (
    <Wrapper className='header-container'>
        {state.map((item) => {
            return <StateItem key={item.title} {...item}></StateItem>
        })}
    </Wrapper>
  )
}

export default StatsContainer