import Wrapper from '../assets/wrappers/Description'

const DescriptionProduct = ({show, handleCloseModal, description, id, name}) => {
  return (
    <Wrapper
    show={show}>
            <div className='modal'>
        <div className="modal-content">
        <button class="close-btn" onClick={handleCloseModal}>X</button>
            <div className="descr-header">
                <div className="product-name">{name}</div>
                <div className="product-id">ID: {id}</div>
            </div>
            <div className="descr-content">
                {description}
            </div>
        </div>
    </div>
    </Wrapper>
  )
}

export default DescriptionProduct