export interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
  buttons?: Array<{
    label: string;
    variant: 'primary' | 'secondary';
  }>;
}

const ProductCard = ({ title, description, image, className, buttons }: ProductCardProps) => {
  return (
    <div className="bg-navy-900/50 rounded-xl overflow-hidden border border-primary/10">
      <div className="p-6">
        <img src={image} alt={title} className={className} />
        <div className="flex justify-between items-center mt-4">
          <h4 className="text-xl font-bold text-primary">{title}</h4>
          {buttons && (
            <div className="flex gap-2">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    button.variant === 'primary'
                      ? 'bg-primary text-black hover:bg-primary/90'
                      : 'bg-gray-800 text-primary hover:bg-gray-700'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default ProductCard;