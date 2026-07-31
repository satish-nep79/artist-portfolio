import Container from "@/core/components/ui/Container";
const PurchaseInquiryScreen = () => {
  return (
    <Container className="pb-7.5 md:pb-15  pt-28 md:pt-44 min-h-screen flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
      <div className="flex flex-1 w-full p-8 bg-glass-bg">
        <div className=" w-fit group p-6 bg-glass-bg-2 border border-glass-border-2 hover:shadow-primary-glow transition-default">
          <img
            src={`${artwork.imageUrl}`}
            alt="Artist Portrait"
            className="max-h-[40vh] lg:max-h-[70vh] object-cover group-hover:scale-105 transition-default"
          />
        </div>
      </div>
      <div className="flex flex-1 w-full p-8 bg-glass-bg"></div>
    </Container>
  );
};

export default PurchaseInquiryScreen;
