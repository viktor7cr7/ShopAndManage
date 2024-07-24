import { Link, useRouteError } from 'react-router-dom'
import Wrapper from '../assets/wrappers/ErrorPage'

const Error = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return (
        <Wrapper>
        <div>
            <h3>Упс! Страница не найдена</h3>
            <p>Кажется, мы не можем найти страницу, которую вы ищете</p>
            <Link to='/'>На главную страницу</Link>
        </div>
        </Wrapper>
    )
  }
  return (
    <div>
         <h1>Error Page</h1>
         <Link to='/'>Вернуться домой</Link>
    </div>
  )
}

export default Error