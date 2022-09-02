import { config } from '../../../config';
import axios, { AxiosResponse } from 'axios';
import { FollowerResponse } from '../interfaces/followerResponseObject';

const refreshTimeout = 1000 * 60 * 2;
const cache = { data: {} as FollowerResponse.RootObj, lastRefresh: 0 };

const twitchHeaders = {
  headers: {
    Authorization: `Bearer ${config.twitchAppCode}`,
    'Client-Id': config.twitchAppClientId,
  },
};

export const getFollowers = async () => {
  if (Date.now() > cache.lastRefresh + refreshTimeout) {
    try {
      const response = await axios.get<
        any,
        AxiosResponse<FollowerResponse.RootObj>
      >(
        `${config.twitchApiBaseUrl}/users/follows?to_id=${config.twitchUserId}&first=100`,
        twitchHeaders,
      );

      const totalCount = response.data.total;
      let localCount = response.data.data.length;
      let lastCursor = response.data.pagination.cursor;
      let tempData = response.data.data;

      while (localCount < totalCount) {
        // eslint-disable-next-line no-await-in-loop
        const nextResponse = await axios.get<
          any,
          AxiosResponse<FollowerResponse.RootObj>
        >(
          `${config.twitchApiBaseUrl}/users/follows?first=100&after=${lastCursor}&to_id=${config.twitchUserId}`,
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
      };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }

  return cache;
};

export default getFollowers;
