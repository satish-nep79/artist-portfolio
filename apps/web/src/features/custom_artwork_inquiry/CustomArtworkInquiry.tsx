import { useState, useEffect } from "react";

import Container from "@/core/components/ui/Container";
import TextField from "@/core/components/ui/TextField";

import { ArtworkApi } from "@/core/data/artwork_api";
import type { Artwork } from "@/core/types/artwork";
import { useParams } from "react-router-dom";
import { ArrowCircleRightIcon } from "@phosphor-icons/react";

import TextArea from "@/core/components/ui/TextArea";
import Button, { ButtonType } from "@/core/components/ui/Button";
import CustomDateField from "@/core/components/ui/CustomDateField";

type RouteParams = {
  artId: string;
};

const CustomArtworkInquiry = () => {
  const [loading, setLoading] = useState(true);
  const [artwork, setArtwork] = useState<Artwork>();

  const { artId } = useParams<RouteParams>();

  // 1. Min Date: Today + 14 days
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 14);

  // 2. Max Date: Today + 3 months
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

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
      fetchArtwork();
    } else {
      alert(`Artwork ID is missing. ${artId}`);
    }
  }, [artId]);

  return loading ? (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h3>Loading...</h3>
    </Container>
  ) : (
    <Container className="pb-7.5 md:pb-15  pt-28 md:pt-44 min-h-screen flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
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
                <span>{artwork!.medium}</span> · <span>{artwork!.year}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 w-full flex-col gap-2">
        <p className="text-primary font-bold">MAKE IT YOURS</p>
        <h3>Custom Artwork Inquiry</h3>
        <p className="text-text-body">
          Tell us about your vision and{" "}
          <span className="text-primary">
            we'll create something unique together.
          </span>
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
          <div className="flex flex-row w-full gap-6">
            <CustomDateField
              id="completionDate"
              name="completionDate"
              label="Preferred Completion Date"
              placeholder="When do you need the artwork?"
              isRequired={true}
              minDate={minDate}
              maxDate={maxDate}
            />
            <TextField
              id="budget"
              name="budget"
              type="currency"
              label="Budget"
              isRequired={true}
              placeholder="What is your budget?"
            />
          </div>
          <div className="flex flex-row w-full gap-6">
            <TextField
              id="height"
              name="height"
              type="number"
              label="Height (cm)"
              placeholder="Height of the artwork"
              isRequired={true}
            />
            <TextField
              id="width"
              name="width"
              type="number"
              label="Width (cm)"
              placeholder="Width of the artwork"
              isRequired={true}
            />
          </div>
          <div>
            <TextArea
              id="description"
              name="description"
              label="Description"
              placeholder="Describe your idea, preferred style, colors, size, and any other details that will help the artist understand your vision."
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
    </Container>
  );
};

export default CustomArtworkInquiry;
