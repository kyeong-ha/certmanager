import { createContext, useContext } from 'react';

interface ReissueLogConfig {
  defaultDeliveryType: '선불' | '착불';
  defaultReissueCost: number;
}

export const ReissueLogConfigContext = createContext<ReissueLogConfig>({
  defaultDeliveryType: '선불',
  defaultReissueCost: 0,
});

export const useReissueLogConfig = () => useContext(ReissueLogConfigContext);
