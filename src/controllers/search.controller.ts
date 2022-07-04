import 'dotenv';
import { Router } from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import { FaresResponse, Trip } from '../types/Fares';

const router = Router();

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

router.get('/', async (req, res, next) => {
  try {
    const dateFrom = dayjs('2022-07-06');
    const dateTo = dayjs('2022-12-31');
    const days = 1;
    const daysToCheck = dateTo.diff(dateFrom, 'day') - days;

    const trips: Trip[] = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < daysToCheck; i++) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(Math.random() * 1000);
      const url = `${process.env.BASE_URL}/api/farfnd/v4/roundTripFares?departureAirportIataCode=KRK&outboundDepartureDateFrom=${dateFrom.add(i, 'days').format('YYYY-MM-DD')}&outboundDepartureDateTo=${dateFrom.add(i, 'days').format('YYYY-MM-DD')}&inboundDepartureDateFrom=${dateFrom.add(i + days, 'days').format('YYYY-MM-DD')}&inboundDepartureDateTo=${dateFrom.add(i + days, 'days').format('YYYY-MM-DD')}&market=pl-pl&adultPaxCount=1`;

      // eslint-disable-next-line no-console
      console.log(url);

      // eslint-disable-next-line no-await-in-loop
      const response = await axios.get<FaresResponse>(url);

      response.data.fares.forEach((fare) => {
        trips.push({
          inbound: {
            date: fare.inbound.departureDate,
            flightNumber: fare.inbound.flightNumber,
          },
          outbound: {
            date: fare.outbound.departureDate,
            flightNumber: fare.outbound.flightNumber,
          },
          price: {
            value: fare.summary.price.value,
            currency: fare.summary.price.currencyCode,
          },
          tripDurationDays: fare.summary.tripDurationDays,
          destination: {
            country: fare.outbound.arrivalAirport.countryName,
            airport: fare.outbound.arrivalAirport.iataCode,
            city: fare.outbound.arrivalAirport.city.name,
          },
        });
      });
    }

    trips.sort((a, b) => a.price.value - b.price.value);

    return res.json(trips);
  } catch (e) {
    return next(e);
  }
});

export default router;
