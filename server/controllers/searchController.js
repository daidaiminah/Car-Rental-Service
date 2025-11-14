import db from '../models/index.js';
import siteContentEntries from '../data/siteContent.js';

const { Op } = db.Sequelize;

const normalizeQuery = (value = '') => value.trim().toLowerCase();

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return null;
  }
  return numeric.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
};

const buildCarResult = (car) => {
  const title = `${car.make} ${car.model}`.trim();
  const subtitleParts = [car.year, car.type];
  const subtitle = subtitleParts.filter(Boolean).join(' • ');
  const badges = [
    car.transmission ? car.transmission[0].toUpperCase() + car.transmission.slice(1) : null,
    car.seats ? `${car.seats} seats` : null
  ].filter(Boolean);

  return {
    id: car.id,
    title,
    subtitle,
    meta: formatCurrency(car.rentalPricePerDay)
      ? `${formatCurrency(car.rentalPricePerDay)}/day`
      : null,
    badges,
    link: `/cars/${car.id}`,
    category: 'cars'
  };
};

const buildContentResult = (entry) => ({
  id: entry.id,
  title: entry.title,
  description: entry.description,
  link: entry.link,
  category: entry.category
});

export const searchSite = async (req, res) => {
  try {
    const query = req.query.q || '';
    const trimmedQuery = query.trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 6, 15);

    if (!trimmedQuery) {
      return res.json({
        query: '',
        results: {
          cars: [],
          pages: [],
          support: []
        }
      });
    }

    const normalizedQuery = normalizeQuery(trimmedQuery);

    const likePattern = `%${trimmedQuery}%`;
    const carMatches = await db.Car.findAll({
      where: {
        [Op.or]: [
          { make: { [Op.iLike]: likePattern } },
          { model: { [Op.iLike]: likePattern } },
          db.Sequelize.where(
            db.Sequelize.cast(db.Sequelize.col('Car.type'), 'text'),
            { [Op.iLike]: likePattern }
          ),
          { location: { [Op.iLike]: likePattern } }
        ]
      },
      limit,
      order: [['createdAt', 'DESC']]
    });

    const cars = carMatches.map(buildCarResult);

    const contentMatches = siteContentEntries.filter((entry) => {
      const haystack = `${entry.title} ${entry.description} ${entry.keywords?.join(' ') || ''}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    const pages = contentMatches
      .filter((entry) => entry.category === 'pages')
      .slice(0, limit)
      .map(buildContentResult);

    const support = contentMatches
      .filter((entry) => entry.category === 'support')
      .slice(0, limit)
      .map(buildContentResult);

    return res.json({
      query: trimmedQuery,
      results: {
        cars,
        pages,
        support
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to perform search at the moment.'
    });
  }
};

export default searchSite;
