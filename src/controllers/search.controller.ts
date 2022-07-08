import 'dotenv';
import { Router } from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import Joi from 'joi';
import { FaresResponse, Trip } from '../types/Fares';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';

const router = Router();

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const searchSchema = {
  body: {
    dateFrom: Joi.date().required(),
    dateTo: Joi.date().required(),
    days: Joi.number().min(0).max(365).required(),
    originAirport: Joi.string().length(3).required(),
    numberOfAdults: Joi.number().min(1).max(5).required(),
    airline: Joi.string().length(3).required(),
  },
};

router.post('/', validation(searchSchema), async (req: TypedRequest<typeof searchSchema>, res, next) => {
  try {
    const dateFrom = dayjs(req.body.dateFrom);
    const dateTo = dayjs(req.body.dateTo);
    const { days, originAirport, numberOfAdults } = req.body;
    const daysToCheck = dateTo.diff(dateFrom, 'day') - days;

    const trips: Trip[] = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < daysToCheck + 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(Math.random() * 1000);
      const url = `${process.env.BASE_URL}/api/farfnd/v4/roundTripFares?departureAirportIataCode=${originAirport}&outboundDepartureDateFrom=${dateFrom.add(i, 'days').format('YYYY-MM-DD')}&outboundDepartureDateTo=${dateFrom.add(i, 'days').format('YYYY-MM-DD')}&inboundDepartureDateFrom=${dateFrom.add(i + days, 'days').format('YYYY-MM-DD')}&inboundDepartureDateTo=${dateFrom.add(i + days, 'days').format('YYYY-MM-DD')}&market=en-GB&adultPaxCount=${numberOfAdults}`;

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
          destination: {
            country: fare.outbound.arrivalAirport.countryName,
            airport: fare.outbound.arrivalAirport.iataCode,
            city: fare.outbound.arrivalAirport.city.name,
          },
          origin: {
            country: fare.outbound.departureAirport.countryName,
            airport: fare.outbound.departureAirport.iataCode,
            city: fare.outbound.departureAirport.city.name,
          },
          airline: {
            icao: 'RYR',
          },
          bookingUrl: `https://www.ryanair.com/pl/pl/trip/flights/select?adults=${numberOfAdults}&dateOut=${dayjs(
            fare.outbound.departureDate,
          ).format('YYYY-MM-DD')}&dateIn=${dayjs(fare.inbound.departureDate).format(
            'YYYY-MM-DD',
          )}&isReturn=true&originIata=${fare.outbound.departureAirport.iataCode}&destinationIata=${
            fare.outbound.arrivalAirport.iataCode
          }`,
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
