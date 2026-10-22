import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  Center,
  Title
} from "@mantine/core";
import Button from "../Interface/Button";
import { TextInputForm, PasswordInputForm } from "../Interface/Form";
import { toast } from "react-toastify";
import Logo from "../Interface/Logo";
import Loader from "../Interface/Loader";
import { Link } from "react-router-dom";

import { useAddImpressionMutation } from "../../slices/utilApiSlice";
import { ImpressionType } from "../../../../shared/types";

const AddImpressionWidget = () => {
  const possibleImpressions = Object.values(ImpressionType);
  const [addImpression, { isLoading }] = useAddImpressionMutation();
  const [submissionDone, setSubmissionDone] = useState<boolean>(false);

  const submitHandler = async (impressionValue: ImpressionType) => {
    try {
      const res = await addImpression({ impressionValue }).unwrap();
      setSubmissionDone(true);
      toast(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Error adding impression");
    }
  };
  
  if (isLoading) {
    return <div><Loader /></div>
  }

  if (submissionDone) {
    return <div>Thank you for sharing your impression!</div>
  }

  return (
    <div style={{textAlign: "center"}}>
      How are you feeling right now?<br />
      {possibleImpressions.map((imp: ImpressionType, i: number) => (
        <button className="imp-btn" key={i} onClick={() => submitHandler(imp)}>{imp}</button>
      ))}
    </div>
  );
}

export default AddImpressionWidget;
