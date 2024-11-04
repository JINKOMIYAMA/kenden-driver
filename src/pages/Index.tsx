import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import RiskDiagram from "../components/RiskDiagram";
import ProductCard, { ProductCardProps } from "../components/ProductCard";
import DriverFeatures from "../components/DriverFeatures";
import { Shield, Zap, Battery, Factory, AlertCircle } from "lucide-react";
import ShoeiLogo from "../assets/images/shoeilogo.jpg";
import PlusDriver from "../assets/images/plus driver.jpg";
import MinusDriver from "../assets/images/minus driver.jpg";
import WorkImage from "../assets/images/work.jpg";

const SpecItem = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl hover:scale-105 transition-transform duration-300">
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h4 className="text-lg font-bold text-primary mb-2">{title}</h4>
    <p className="text-gray-400 text-center text-sm">{description}</p>
  </div>
);

const Index = () => {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll(".fade-in-section").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-dark min-h-screen">
      <HeroSection onLearnMoreClick={scrollToAbout} />
      
      <section id="about-section" className="py-20 container mx-auto px-4 relative">
        <div className="fade-in-section relative z-10">
          <h2 className="section-title">ABOUT</h2>
          <h3 className="section-subtitle">見電ドライバーとは？</h3>
          <DriverFeatures />
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12 text-primary">製品仕様</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SpecItem
                icon={Zap}
                title="検知範囲"
                description="AC100V-240V対応で、幅広い電圧に対応"
              />
              <SpecItem
                icon={Battery}
                title="電源"
                description="単4電池2本で長時間駆動"
              />
              <SpecItem
                icon={Shield}
                title="安全性"
                description="絶縁手袋着用可能な安全設計"
              />
              <SpecItem
                icon={Factory}
                title="Made in Japan"
                description="品質と信頼性にこだわった国内生産"
              />
            </div>
          </div>

          <div className="mt-24 relative">
            <div className="absolute inset-0 bg-navy-900/30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(30, 41, 59, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(30, 41, 59, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            <div className="relative z-10">
              <h2 className="section-title">SAFETY</h2>
              <h3 className="section-subtitle">電気工事をする方々のお悩みを解決</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-left">
                  <div className="bg-dark/50 p-6 rounded-lg border border-primary/20">
                    <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      作業時の不安を解消
                    </h4>
                    <ul className="space-y-3 text-gray-300">
                      <li>・さっき検電したから大丈夫？という不安</li>
                      <li>・目に見えない電気作業の恐怖</li>
                      <li>・通電状態の確実な確認</li>
                      <li>・スイッチの切り忘れ防止</li>
                    </ul>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10" />
                  <img
                    src={WorkImage}
                    alt="電気工事作業"
                    className="rounded-lg object-cover w-full h-[300px]"
                  />
                </div>
              </div>

              <div className="mt-12 bg-orange-900/5 border border-orange-800/10 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-700/60 rounded-full p-2 mt-1">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-orange-300 font-bold text-lg mb-3">使用上の注意</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        ゴム手袋、ゴム長靴、ゴーグル等の安全保護具の着用をしてください。
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        水滴、打撃などの強い衝撃を与えないでください。
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        水のかかる場所や湿気の多い場所では使用しないでください。
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark">
        <div className="container mx-auto px-4">
          <div className="fade-in-section">
            <h2 className="section-title">Products</h2>
            <h3 className="section-subtitle">製品ラインナップ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProductCard
                title="見電ドライバー（＋）"
                description="プラスドライバー型の検電ドライバー"
                image={PlusDriver}
                className="aspect-[4/3] object-contain"
                buttons={[
                  { label: "購入", variant: "primary" }
                ]}
              />
              <ProductCard
                title="見電ドライバー（－）"
                description="マイナスドライバー型の検電ドライバー"
                image={MinusDriver}
                className="aspect-[4/3] object-contain"
                buttons={[
                  { label: "購入", variant: "primary" }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-4">
          <div className="fade-in-section">
            <h2 className="section-title">Company</h2>
            <h3 className="section-subtitle mb-12">会社概要</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-6">
                <div className="bg-dark/50 p-8 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <img 
                        src={ShoeiLogo}
                        alt="昭栄電気産業ロゴ"
                        className="w-13 h-14 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-primary">株式会社昭栄電気産業</h4>
                      <p className="text-base md:text-lg text-gray-400">Shoei Electrical Industries Co., Ltd.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <div className="flex gap-4">
                      <span className="text-sm md:text-lg font-medium text-primary">所在地</span>
                      <span className="text-sm md:text-lg">〒125-0053 東京都葛飾区鎌倉3-58-2</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm md:text-lg font-medium text-primary">製造元</span>
                      <span className="text-sm md:text-lg">株式会社ベッセル</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm md:text-lg font-medium text-primary">お問い合わせ</span>
                      <span className="text-sm md:text-lg">shoei-buppan@shoeinet.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                  alt="会社外観"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-lg text-gray-200">
                    電気工事の安全性と効率性を追求し、
                    革新的なツールで業界をリードする企業として。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
