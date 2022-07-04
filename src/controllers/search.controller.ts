import 'dotenv';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const x: string[] = [];
    x.push(`${process.env.BASE_URL}api/locate/v5/airports?phrase=&market=pl-pl&fields=code&fields=name&fields=seoName&fields=base&fields=timeZone&fields=aliases&fields=city.code&fields=city.name&fields=coordinates.latitude&fields=coordinates.longitude&fields=macCity.code&fields=macCity.name&fields=macCity.macCode&fields=region.code&fields=region.name&fields=country.code&fields=country.name&fields=country.currency&fields=base`);
    return res.json(x);
  } catch (e) {
    return next(e);
  }
});

export default router;
