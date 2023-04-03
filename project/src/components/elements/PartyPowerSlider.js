import * as React from 'react';
import { rgbToHex, styled, withStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
//import VolumeUp from '@mui/icons-material/VolumeUp';

const Typography = styled(MuiTypography)({
  color: "white",
});

const Input = styled(MuiInput)({
  color: "white",
});

const SliderColor = styled(Slider)({
  color: "#1ED760",
});

export default function InputSlider(props) {
  const [value, setValue] = React.useState(30);
  //const {name} = props;



  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.update(props.name, newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider"  gutterBottom>
        {props.name}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <SliderColor
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
