import { DevicesData } from '../types';

// 在Vite中，/public目录下的资源可以直接通过根路径访问
export const devicesData: DevicesData = {
  "version": "1.0.1",
  "lastUpdated": "2025-05-07T22:00:00Z",
  "devices": {
    "Bayer-Centargo": {
      "brand": "Bayer",
      "model": "Centargo",
      "category": "高压注射器",
      "isBase": false,
      "imageUrl": "/images/devices/bayer-centargo.png",
      "specs": {
        "耗材更换时间_分钟": 0.33,
        "单次检查总耗时_分钟": 5,
        "信息化支持": true,
        "智能协议支持": true,
        "单次检查耗材成本_元": 100,
        "设备采购成本_万元": 33,
        "设备10年折旧率": 8,
        "临床精准度": 9,
        "科研附加值": 9,
        "工作效率": 8,
        "易用性": 8,
        "维护便捷性": 8.5,
        "造影剂节省量": 9,
        "注射技术类型": "活塞式",
        "管路类型": "三筒",
        "NMPA等级": "NMPA ClassIII"
      }
    },
    "Ulrich-CTMotion": {
      "brand": "Ulrich",
      "model": "CTMotion",
      "category": "高压注射器",
      "isBase": true,
      "imageUrl": "/images/devices/ulrich-ctmotion.png",
      "specs": {
        "耗材更换时间_分钟": 2,
        "单次检查总耗时_分钟": 7,
        "信息化支持": true,
        "智能协议支持": false,
        "单次检查耗材成本_元": 110,
        "设备采购成本_万元": 25,
        "设备10年折旧率": 10,
        "临床精准度": 7,
        "科研附加值": 7,        
        "工作效率": 7,
        "易用性": 7.5,
        "维护便捷性": 7,
        "造影剂节省量": 7.5,
        "注射技术类型": "蠕吸式",
        "管路类型": "三筒",
        "NMPA等级": "NMPA ClassII"
      }
    },
    "Guerbet-OptiVantage": {
      "brand": "Guerbet",
      "model": "OptiVantage",
      "category": "高压注射器",
      "isBase": false,
      "imageUrl": "/images/devices/guerbet-optivantage.png",
      "specs": {
        "耗材更换时间_分钟": 3,
        "单次检查总耗时_分钟": 8,
        "信息化支持": true,
        "智能协议支持": false,
        "单次检查耗材成本_元": 125,
        "设备采购成本_万元": 24,
        "设备10年折旧率": 9,
        "临床精准度": 7,        
        "科研附加值": 6,
        "工作效率": 7.5,
        "易用性": 7,
        "维护便捷性": 7.5,
        "造影剂节省量": 8,
        "注射技术类型": "蠕吸式",
        "管路类型": "双筒",
        "NMPA等级": "NMPA ClassII"
      }
    },
    "Bayer-Stellant": {
      "brand": "Bayer",
      "model": "Stellant DCE",
      "category": "高压注射器",
      "isBase": true,
      "imageUrl": "/images/devices/bayer-stellant.png",
      "specs": {
        "耗材更换时间_分钟": 3,
        "单次检查总耗时_分钟": 10,
        "信息化支持": true,
        "智能协议支持": false,
        "单次检查耗材成本_元": 110,
        "设备采购成本_万元": 20,
        "设备10年折旧率": 8,
        "临床精准度": 8.5,
        "科研附加值": 8,
        "工作效率": 7,
        "易用性": 7.5,
        "维护便捷性": 7,
        "造影剂节省量": 7,
        "注射技术类型": "活塞式",
        "管路类型": "双筒",
        "NMPA等级": "NMPA ClassII"
      }
    },
    "CLear-Edot": {
      "brand": "Clear",
      "model": "Edot",
      "category": "高压注射器",
      "isBase": true,
      "imageUrl": "/images/devices/clear-edot.png",
      "specs": {
        "耗材更换时间_分钟": 2,
        "单次检查总耗时_分钟": 8,
        "信息化支持": true,
        "智能协议支持": false,
        "单次检查耗材成本_元": 120,
        "设备采购成本_万元": 15,
        "设备10年折旧率": 12,
        "临床精准度": 6,
        "科研附加值": 6,
        "工作效率": 7,
        "易用性": 7,
        "维护便捷性": 6,
        "造影剂节省量": 7,
        "注射技术类型": "蠕吸式",
        "管路类型": "三筒",
        "NMPA等级": "NMPA ClassII"
      }
    },
    "Medtron-Accutron": {
      "brand": "Medtron",
      "model": "Accutron",
      "category": "高压注射器",
      "isBase": false,
      "imageUrl": "/images/devices/medtron-accutron.png",
      "specs": {
        "耗材更换时间_分钟": 3,
        "单次检查总耗时_分钟": 10,
        "信息化支持": false,
        "智能协议支持": false,
        "单次检查耗材成本_元": 88,
        "设备采购成本_万元": 15,
        "设备10年折旧率": 10,
        "临床精准度": 7,        
        "科研附加值": 7,
        "工作效率": 6,
        "易用性": 7,
        "维护便捷性": 6,
        "造影剂节省量": 6,
        "注射技术类型": "蠕吸式",
        "管路类型": "双筒",
        "NMPA等级": "NMPA ClassII"
      }
    }
  }
};

export const getDeviceById = (id: string) => {
  return devicesData.devices[id];
};

export const getBaseDevice = () => {
  const baseDeviceEntry = Object.entries(devicesData.devices).find(
    ([_, device]) => device.isBase
  );
  return baseDeviceEntry ? baseDeviceEntry[0] : 'Ulrich-CTMotion';
};

export const getDeviceOptions = () => {
  return Object.keys(devicesData.devices).map(id => ({
    id,
    name: `${devicesData.devices[id].brand} ${devicesData.devices[id].model}`
  }));
};

export const getBrandModels = () => {
  const brands: Record<string, string[]> = {};
  
  Object.entries(devicesData.devices).forEach(([id, device]) => {
    const { brand, model } = device;
    if (!brands[brand]) {
      brands[brand] = [];
    }
    brands[brand].push(id);
  });
  
  return brands;
};