import { useState, useEffect, useRef } from "react";

import Container from "@/core/components/ui/Container";
import TextField from "@/core/components/ui/TextField";

import { ArtworkApi } from "@/core/data/artwork_api";
import type { Artwork } from "@/core/types/artwork";
import { useParams } from "react-router-dom";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

import TextArea from "@/core/components/ui/TextArea";
import Button, { ButtonType } from "@/core/components/ui/Button";

type RouteParams = {
  artId: string;
};

const PurchaseInquiryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [artwork, setArtwork] = useState<Artwork>();

  const screenRef = useRef<HTMLDivElement | null>(null);

  const { artId } = useParams<RouteParams>();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const data = await ArtworkApi.getBySlug(artId ?? "");
        setArtwork(data);
      } catch (error) {
        alert("Failed to fetch artwork. Please try again later.");
        console.error("Error fetching artwork:", error);
      } finally {
        setLoading(false);
      }
    };

    if (artId !== undefined) {
      screenRef.current?.scrollTo({ top: 0 });
      fetchArtwork();
    } else {
      alert(`Artwork ID is missing. ${artId}`);
    }
  }, [artId]);

  return (
    <Container
      ref={screenRef}
      className="pb-7.5 md:pb-15  pt-28 md:pt-44 min-h-screen"
    >
      {loading ? (
        <div className="bg-amber-50 min-h-[70vh] ">
          <h3 className="text-text-body text-caption">Loading artwork...</h3>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
          <div className="flex flex-1 w-full flex-col gap-3 justify-center">
            <p className="font-bold text-text-secondary">Selected Artwork</p>
            <div className=" w-fit h-fit group p-6 bg-glass-bg-2 border border-glass-border-2 hover:shadow-primary-glow transition-default relative items-start">
              <img
                src={`${artwork?.imageUrl}`}
                alt="Artist Portrait"
                className="max-h-[40vh] lg:max-h-[70vh] object-cover group-hover:scale-105 transition-default"
              />
              <div className="absolute inset-0 h-full bg-overlay-vertical flex flex-col justify-end px-6 py-6">
                <div className="w-full text-left">
                  <p className="text-base text-primary">{artwork!.category}</p>
                  <h6>{artwork!.title}</h6>
                  <p className="text-text-body">
                    <span>{artwork!.medium}</span> ·{" "}
                    <span>{artwork!.year}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 w-full flex-col gap-2">
            <p className="text-primary font-bold">INTERESTED</p>
            <h3>Purchase Inquiry</h3>
            <p className="text-text-body">
              Complete the form below to inquire about this artwork. <br />
              The artist will get back to you with availability and next steps.
            </p>
            <div className="h-4" />
            <form
              className="flex flex-col gap-4 w-full h-full justify-between"
              action="#"
              method="POST"
            >
              <div className="flex flex-row w-full gap-6">
                <TextField
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Your Full Name"
                  isRequired={true}
                />
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  isRequired={true}
                />
              </div>
              <div className="flex flex-row w-full gap-6">
                <TextField
                  id="country"
                  name="country"
                  type="text"
                  label="Country"
                  placeholder="Country of Residence"
                  isRequired={true}
                />
                <TextField
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  isRequired={true}
                  placeholder="+977 9812345678"
                />
              </div>
              <div>
                <TextArea
                  id="message"
                  name="message"
                  label="Message"
                  placeholder="Provide Addtional Details or Questions"
                />
                <p className="text-text-body text-caption mt-4">
                  I personally review every inquiry and usually reply within 2–3
                  business days.
                </p>
              </div>
              <Button
                label="Send Message"
                buttonType={ButtonType.PRIMARY}
                onClick={() => {}}
                icon={ArrowCircleRightIcon}
              />
            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PurchaseInquiryScreen;
