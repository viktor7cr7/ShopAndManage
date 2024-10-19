import { Form } from 'react-router-dom';
import FormRowSelect from './FormRowSelect';
import { useSubmit, Link } from 'react-router-dom';
import { PRODUCT_CATEGORY } from '../utils/constants';
import { useState, useEffect } from 'react';
import FormRow from './FormRow';
import Wrapper from '../assets/wrappers/FIltersShop';
import { WrapperRange } from '../assets/wrappers/RangeStyle';
import { useAllProductsContext } from '../pages/AllProductShop';
import PriceRange from './RangePrice';

const FiltersShop = () => {
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 1000);
    };
  };

  const [showPriceRange, setShowPriceRange] = useState(false);
  const [values, setValues] = useState([10, 100]);
  const min = 0;
  const max = 999999;

  const sortOptions = {
    price: ['asc', 'desc'],
    rating: ['asc', 'desc'],
  };

  const [priceSort, setPriceSort] = useState('');
  const [ratingSort, setRatingSort] = useState('');

  useEffect(() => {
    const form = document.querySelector('.form');
    submit(form);
  }, [priceSort, ratingSort]);

  const handleSortChange = (e, setSort) => {
    const value = e.target.value;
    setSort(value === 'Не выбрано' ? '' : value);
  };

  const { searchValues } = useAllProductsContext();
  const { search } = searchValues;

  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center grid-container" id="filters">
          <FormRow
            type="search"
            name="search"
            id="filter-search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
            required={false}
          ></FormRow>
          <FormRowSelect
            id="filter-category"
            name={'category'}
            list={['All', ...PRODUCT_CATEGORY]}
            onChange={(e) => submit(e.currentTarget.form)}
          ></FormRowSelect>
          <FormRowSelect
            id="sort-price"
            name="Sort by price"
            list={['Не выбрано', ...sortOptions.price]}
            value={priceSort}
            onChange={(e) => handleSortChange(e, setPriceSort)}
          ></FormRowSelect>
          <FormRowSelect
            name="Sort by rating"
            id="sort-rating"
            list={['Не выбрано', ...sortOptions.rating]}
            value={ratingSort}
            onChange={(e) => handleSortChange(e, setRatingSort)}
          ></FormRowSelect>
          <input type="hidden" name="sort" value={`price:${priceSort},rating:${ratingSort}`} />
          <WrapperRange>
            <button
              type="button"
              className={`bth-action ${showPriceRange ? 'show-range' : 'hidden-range'}`}
              onClick={() => setShowPriceRange(!showPriceRange)}
            >
              {showPriceRange ? 'Hide Price Range' : 'Show Price Range'}
            </button>
            {showPriceRange && (
              <>
                <PriceRange values={values} setValues={setValues} min={min} max={max} />
                <input type="hidden" name="minPrice" value={values[0]} />
                <input type="hidden" name="maxPrice" value={values[1]} />
                <button type="button" className="btn-apply" onClick={(e) => submit(e.currentTarget.form)}>
                  Apply
                </button>
              </>
            )}
          </WrapperRange>
          <Link to="/dashboard/user/all-products" type="button" className="link-reset">
            Сбросить фильтры
          </Link>
          <div></div>
        </div>
      </Form>
    </Wrapper>
  );
};

export default FiltersShop;
