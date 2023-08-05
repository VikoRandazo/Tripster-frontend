import * as yup from "yup";

//  const vacationSchema = yup.object().shape({
//     destination: yup.string().required(),
//     description: yup.string().required(),
//     start_date:yup.date().required(),
//     end_date: yup.date().required(),
//     price:  yup.number().min(1).max(10000).required(),
//     image_path: yup.string().url().required(),
// })

// export default vacationSchema

export const vacationSchema = yup.object().shape({
  vacation_id: yup.number().required(),
  destination: yup.string().max(100).required(),
  description: yup.string().max(1000).required(),
  start_date: yup
    .date()
    .transform((originalValue) => {
      return new Date(originalValue);
    })
    .min(new Date().toISOString())
    .required(),
  end_date: yup
    .date()
    .transform((originalValue) => {
      return new Date(originalValue);
    })
    .min(yup.ref("start_date"), "End date cannot be before Start date")
    .required(),
  price: yup.number().max(10000).positive().min(1).required(),
  image_path: yup.string().max(500).url().required(),
});

export const vacationSearchSchema = yup.object().shape({
  destination: yup.string().max(100),
  description: yup.string().max(1000),
  start_date: yup
    .date()
    .transform((originalValue) => {
      return new Date(originalValue);
    })
    .min(new Date().toISOString()),
  end_date: yup
    .date()
    .transform((originalValue) => {
      return new Date(originalValue);
    })
    .min(yup.ref("start_date"), "End date cannot be before Start date"),
  price: yup.number().max(10000).positive().min(0),
  image_path: yup.string().max(500).url(),
});
