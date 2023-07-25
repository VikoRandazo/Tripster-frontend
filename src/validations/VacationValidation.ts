import * as yup from "yup"

 const vacationSchema = yup.object().shape({
    destination: yup.string().required(),
    description: yup.string().required(),
    start_date:yup.date().required(),
    end_date: yup.date().required(),
    price:  yup.number().min(1).max(10000).required(),
    image_path: yup.string().url().required(),
})

export default vacationSchema