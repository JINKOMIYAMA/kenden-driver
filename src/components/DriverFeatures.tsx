import { motion } from "framer-motion";
import ElectricWorkBg from '../assets/images/Electric work.jpg';
import PlusDriver from '../assets/images/driver photo.jpg';
import { useState, useEffect } from 'react';

const features = [
  {
    id: 1,
    title: "先端保護",
    description: "先端6mmまで金属部分をチューブで保護",
    pcPosition: "top-[130px] left-[-90px]",
    mobilePosition: "top-[0px] left-[20px]",
    pcSize: "max-w-xs",
    mobileSize: "max-w-[150px]",
    pcLine: { x2: "60%", y2: "30%" },
    mobileLine: { x2: "90%", y2: "40%" },
  },
  {
    id: 2,
    title: "テストボタン",
    description: "テストボタンで使用前点検が可能",
    pcPosition: "top-[120px] right-[180px]",
    mobilePosition: "top-[100px] right-[10px]",
    pcSize: "max-w-xs",
    mobileSize: "max-w-[150px]",
    pcLine: { x2: "20%", y2: "30%" },
    mobileLine: { x2: "10%", y2: "70%" },
  },
  {
    id: 3,
    title: "LEDインジケーター",
    description: "作業箇所の通電・無電が見える高精度LED",
    pcPosition: "bottom-[130px] left-[100px]",
    mobilePosition: "bottom-[200px] left-[0px]",
    pcSize: "max-w-xs",
    mobileSize: "max-w-[150px]",
    pcLine: { x2: "70%", y2: "70%" },
    mobileLine: { x2: "150%", y2: "80%" },
  },
  {
    id: 4,
    title: "滑り止めグリップ",
    description: "ゴム製の持ちやすい滑り止め",
    pcPosition: "bottom-[100px] right-[20px]",
    mobilePosition: "bottom-[-10px] right-[20px]",
    pcSize: "max-w-xs",
    mobileSize: "max-w-[150px]",
    pcLine: { x2: "30%", y2: "75%" },
    mobileLine: { x2: "30%", y2: "60%" },
  },
];

const DriverFeatures = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative py-10 w-screen overflow-hidden -mx-[50vw] left-[50%] right-[50%]">
      <div 
        className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-dark before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-b after:from-dark after:to-transparent"
        style={{
          backgroundImage: `url(${ElectricWorkBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7) blur(4px)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8"></div>
        <div className="relative md:w-[800px] w-full h-[600px] mx-auto">
          {/* 特徴説明（先に配置） */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`
                absolute 
                z-30 
                ${windowWidth >= 768 ? feature.pcPosition : feature.mobilePosition}
                ${windowWidth >= 768 ? feature.pcSize : feature.mobileSize}
              `}
            >
              <div className="relative">
                {/* 上部の特徴（id: 1, 2）用のSVG */}
                {feature.id <= 2 && (
                  <svg
                    className="absolute inset-0 text-primary"
                    width="100%"
                    height="200"
                    style={{
                      top: '100%',
                      pointerEvents: 'none'
                    }}
                  >
                    <line 
                      x1="50%" 
                      y1="0" 
                      x2={`${feature.pcLine.x2}`}
                      y2={`${feature.pcLine.y2}`}
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="md:block hidden"
                    />
                    <line 
                      x1="50%" 
                      y1="0" 
                      x2={`${feature.mobileLine.x2}`}
                      y2={`${feature.mobileLine.y2}`}
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="md:hidden block"
                    />
                  </svg>
                )}

                {/* 下部の特徴（id: 3, 4）用のSVG */}
                {feature.id > 2 && (
                  <svg
                    className="absolute inset-0 text-primary"
                    width="100%"
                    height="200"
                    style={{
                      transform: 'translateY(-100%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <line 
                      x1="50%" 
                      y1="100%" 
                      x2={`${feature.pcLine.x2}`}
                      y2={`${feature.pcLine.y2}`}
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="md:block hidden"
                    />
                    <line 
                      x1="50%" 
                      y1="100%" 
                      x2={`${feature.mobileLine.x2}`}
                      y2={`${feature.mobileLine.y2}`}
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="md:hidden block"
                    />
                  </svg>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-dark/80 backdrop-blur-sm md:p-4 p-3 rounded-lg border border-primary/20"
                >
                  <h4 className="text-primary font-bold mb-2 md:text-base text-sm">{feature.title}</h4>
                  <p className="md:text-sm text-xs text-gray-300">{feature.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* ドライバー画像（後に配置） */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <img
              src={PlusDriver}
              alt="プラスドライバー"
              className={`
                w-auto 
                object-contain 
                ${windowWidth >= 768 ? 'h-[600px] rotate-[-135deg]' : 'h-[300px] rotate-[-45deg]'}
              `}
            />
          </motion.div>
        </div>
      </div>
      <div className="fixed top-0 right-0 bg-black text-white p-2 z-50 opacity-[0.01]">
        Width: {windowWidth}px
      </div>
    </section>
  );
};

export default DriverFeatures;