interface InfoCardProps {
  label: string;
  title: string;
  description: string;
}

const InfoCard = ({ label, title, description }: InfoCardProps) => {
  return (
    <div className="flex flex-col gap-2.5 bg-glass-bg-2 border border-glass-border-2 p-2.5">
      <p className="text-primary text-caption">{label}</p>
      <p className="font-bold">{title}</p>
      <p className="text-text-secondary text-caption">{description}</p>
    </div>
  );
};

export default InfoCard;
