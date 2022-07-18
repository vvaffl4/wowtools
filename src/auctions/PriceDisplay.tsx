import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";

const PriceDisplay: React.FC<{ price: number, includeMinus?: boolean, props?: TypographyProps}> = ({price, includeMinus = true, props}) => {
  const isMinus = includeMinus && price < 0;
  const absPrice = Math.abs(price);

  const goldPrice = Math.floor(absPrice / 10000);
  const silverPrice = Math.floor((absPrice - (goldPrice * 10000)) / 100);
  const copperPrice = (absPrice - (goldPrice * 10000 + silverPrice * 100));
  
  return ( 
    <React.Fragment>
      { isMinus && (
        <Typography component="span" {...props}>
          -
        </Typography>
      )}
      { goldPrice > 0 && (
        <React.Fragment>
          <Typography color='gold' component="span" {...props}>
          { goldPrice }
          </Typography>
          <img alt='gold' src="https://wow.zamimg.com/images/icons/money-gold.gif"/>
        </React.Fragment>
      ) }
      { silverPrice > 0 && (
        <React.Fragment>
          <Typography marginLeft={0.5} color='silver' component="span" {...props}>
            { silverPrice }
          </Typography>
          <img alt='silver' src="https://wow.zamimg.com/images/icons/money-silver.gif"/>
        </React.Fragment>
      ) }
      { copperPrice > 0 && (
        <React.Fragment>
          <Typography marginLeft={0.5} color='brown' component="span" {...props}>
            { copperPrice }
          </Typography>
          <img alt='copper' src="https://wow.zamimg.com/images/icons/money-copper.gif"/>
        </React.Fragment>
      ) }
    </React.Fragment>
  );
}

export default PriceDisplay;