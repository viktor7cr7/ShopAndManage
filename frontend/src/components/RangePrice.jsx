import { Range } from "react-range"
import { Track } from "../assets/wrappers/RangeStyle";
import { Thumb } from "../assets/wrappers/RangeStyle";
import { ThumbLabel } from "../assets/wrappers/RangeStyle";

const PriceRange = ({ values, setValues, min, max }) => (
    <Range
      className='full-width'
      step={1}
      min={min}
      max={max}
      values={values}
      onChange={(values) => setValues(values)}
      renderTrack={({ props, children }) => (
        <Track {...props} min={min} max={max} values={values} className="track-values">
          {children}
        </Track>
      )}
      renderThumb={({ props, index }) => (
        <Thumb {...props}>
          <ThumbLabel>{values[index]}</ThumbLabel>
        </Thumb>
      )}
    />
  );

  export default PriceRange