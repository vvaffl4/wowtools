import { Divider, useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fade from "@mui/material/Fade";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { ChartOptions } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { GameItem } from "./GameItem";
import { MarketItem } from "./MarketItem";
import PriceCategory from "./PriceCategory";
import PriceCompare from "./PriceCompare";
import PriceDetails from "./PriceDetails";

export const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 10
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        callback: function(value) { 
          return new Date(this.getLabels()[value as number]).toLocaleDateString('en-GB', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
        },
      }
    },
    y: {
      ticks: {
        callback: function(value) {
          const price = value as number;

          const goldPrice = Math.floor(price / 10000);
          const silverPrice = Math.floor((price - (goldPrice * 10000)) / 100);
          const copperPrice = (price - (goldPrice * 10000 + silverPrice * 100));

          return `${goldPrice}g ${silverPrice}s ${copperPrice}c`;
        }
      }
    }
  },
};

export const quantityOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 10
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        callback: function(value) { 
          return new Date(this.getLabels()[value as number]).toLocaleDateString('en-GB', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
        },
      }
    }
  },
};

const PriceAuction: React.FC<{ anchor: HTMLElement, itemRecord: { ngk: GameItem & MarketItem, pwv: GameItem & MarketItem }, onClose: () => void }> = ({ anchor, itemRecord, onClose }) => {
  const theme = useTheme();

  const open = Boolean(anchor);

  return ( 
    <Popover 
      sx={{
        left: '15px',
      }}
      open={open}
      onClose={onClose}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      TransitionComponent={Fade}
      transitionDuration={500}
    >
      <Card
        sx={{
          width: `${anchor?.clientWidth}px`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <CardContent>
        <Stack
          direction="row"
          spacing={3}
          marginX={0.5}
        >
          <PriceDetails
            name={itemRecord.ngk.name}
            icon={itemRecord.ngk.icon}
            tags={itemRecord.ngk.tags}
            tooltip={itemRecord.ngk.tooltip}
            sellPrice={itemRecord.ngk.sellPrice}
          />
          <Divider orientation="vertical" flexItem />
          <PriceCategory 
            category='NGK Min Buyout'
            lastUpdated={itemRecord.ngk.stats.lastUpdated}
            current={itemRecord.ngk.stats.current.minBuyout}
            previousUpdated={itemRecord.ngk.data[itemRecord.ngk.data.length - 2].scannedAt}
            previous={itemRecord.ngk.stats.previous.minBuyout}
          />
          <PriceCompare
            priceDifference={itemRecord.ngk.stats.current.minBuyout - itemRecord.pwv.stats.current.minBuyout}
          />
          <PriceCategory 
            category='PWV Min Buyout'
            lastUpdated={itemRecord.ngk.stats.lastUpdated}
            current={itemRecord.pwv.stats.current.minBuyout}
            previousUpdated={itemRecord.ngk.data[itemRecord.ngk.data.length - 2].scannedAt}
            previous={itemRecord.pwv.stats.previous.minBuyout}
          />
          <Divider orientation="vertical" flexItem/>
          <PriceCategory 
            category='NGK Market Value'
            lastUpdated={itemRecord.ngk.stats.lastUpdated}
            current={itemRecord.ngk.stats.current.marketValue}
            previousUpdated={itemRecord.ngk.data[itemRecord.ngk.data.length - 2].scannedAt}
            previous={itemRecord.ngk.stats.previous.marketValue}
          />
          <PriceCompare
            priceDifference={itemRecord.ngk.stats.current.marketValue - itemRecord.pwv.stats.current.marketValue}
          />
          <PriceCategory 
            category='PWV Market Value'
            lastUpdated={itemRecord.ngk.stats.lastUpdated}
            current={itemRecord.pwv.stats.current.marketValue}
            previousUpdated={itemRecord.ngk.data[itemRecord.ngk.data.length - 2].scannedAt}
            previous={itemRecord.pwv.stats.previous.marketValue}
          />
        </Stack>
        <Stack direction={'row'}>
          <div style={{ width: '33%', height: '200px'}}>
            <Line
              style={{ width: '100%' }}
              options={options}
              title='Min Buyout'
              data={{
                labels: itemRecord.ngk.data.map(record => new Date(record.scannedAt)),
                datasets: [
                  {
                    label: 'NGK',
                    tension: 0.2,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: itemRecord.ngk.data.map(record => record.minBuyout),
                  },
                  {
                    label: 'PWV',
                    tension: 0.2,
                    backgroundColor: 'rgb(132, 99, 255)',
                    borderColor: 'rgb(132, 99, 255)',
                    data: itemRecord.pwv.data.map(record => record.minBuyout),
                  },
                ]
              }}
              height='300px'
            />
          </div>
          <div style={{ width: '33%', height: '200px'}}>
            <Line
              style={{ width: '100%' }}
              options={options}
              title='Market Value'
              data={{
                labels: itemRecord.ngk.data.map(record => new Date(record.scannedAt)),
                datasets: [
                  {
                    label: 'NGK',
                    tension: 0.2,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: itemRecord.ngk.data.map(record => record.marketValue),
                  },
                  {
                    label: 'PWV',
                    tension: 0.2,
                    backgroundColor: 'rgb(132, 99, 255)',
                    borderColor: 'rgb(132, 99, 255)',
                    data: itemRecord.pwv.data.map(record => record.marketValue),
                  },
                ]
              }}
              height='300px'
            />
          </div>
          <div style={{ width: '33%', height: '200px'}}>
            <Line
              style={{ width: '100%' }}
              options={quantityOptions}
              title='Quantity'
              data={{
                labels: itemRecord.ngk.data.map(record => new Date(record.scannedAt)),
                datasets: [
                  {
                    label: 'NGK',
                    tension: 0.2,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: itemRecord.ngk.data.map(record => record.quantity),
                  },
                  {
                    label: 'PWV',
                    tension: 0.2,
                    backgroundColor: 'rgb(132, 99, 255)',
                    borderColor: 'rgb(132, 99, 255)',
                    data: itemRecord.pwv.data.map(record => record.quantity),
                  },
                ]
              }}
              height='300px'
            />
          </div>
        </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}

export default PriceAuction;