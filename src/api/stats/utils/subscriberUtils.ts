import { config } from '../../../config';
import axios, { AxiosResponse } from 'axios';
import { SubscriberResponse } from '../interfaces/subscriberResponseObject';

const refreshTimeout = 1000 * 60 * 2;
const cache = { data: {} as SubscriberResponse.RootObj, lastRefresh: 0 };

const twitchHeaders = {
  headers: {
    Authorization: `Bearer ${config.twitchAppCode}`,
    'Client-Id': config.twitchAppClientId,
  },
};

export const getSubscribers = async () => {
  if (Date.now() > cache.lastRefresh + refreshTimeout) {
    try {
      const response = await axios.get<
        any,
        AxiosResponse<SubscriberResponse.RootObj>
      >(
        `${config.twitchApiBaseUrl}/subscriptions?first=100&broadcaster_id=${config.twitchUserId}`,
        twitchHeaders,
      );

      const totalCount = response.data.total;
      const totalPoints = response.data.points;
      let localCount = response.data.data.length;
      let lastCursor = response.data.pagination.cursor;
      let tempData = response.data.data;

      while (localCount < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const nextResponse = await axios.get<
          any,
          AxiosResponse<SubscriberResponse.RootObj>
        >(
          `${config.twitchApiBaseUrl}/subscriptions?first=100&after=${lastCursor}&broadcaster_id=${config.twitchUserId}`,
          twitchHeaders,
        );
        localCount += nextResponse.data.data.length;
        lastCursor = nextResponse.data.pagination.cursor;
        tempData = tempData.concat(nextResponse.data.data);
      }

      cache.lastRefresh = Date.now();
      cache.data = {
        total: totalCount,
        data: tempData,
        pagination: { cursor: lastCursor },
        points: totalPoints,
      };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }

  return cache;
};

export default getSubscribers;
