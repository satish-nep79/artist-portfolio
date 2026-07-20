import type { Icon } from "@phosphor-icons/react/dist/lib/index";

interface ServiceCardProps {
  icon: Icon;
  title: string;
  description: string;
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
  return (
    <div className="group flex flex-col gap-2.5 bg-glass-bg-2 border border-glass-border-2 p-6 hover:shadow-primary-glow transition-default">
      <div className="p-2 bg-glass-bg-2 border border-glass-border-2 rounded-full w-fit group-hover:shadow-primary-glow transition-default">
        <Icon height={32} width={32} weight="fill" className="text-primary" />
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-text-secondary text-caption">{description}</p>
    </div>
  );
};

export default ServiceCard;
