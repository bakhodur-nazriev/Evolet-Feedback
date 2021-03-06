import React, { useState, useEffect } from "react";
import FileInput from "./FileInput";

function PromoCompanyForm({ promoCompany, onSubmit, onCancel }) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        if(promoCompany){
            setName(promoCompany.name);
        }
    }, []);

    const onFormSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("logo", logo);

        onSubmit(formData);
    };

    const onNameChange = ({ target }) => {
        setName(target.value);
    };

    const onLogoChange = image => {
        setLogo(image);
    };

    return (
        <div>
            <form onSubmit={onFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Название</label>
                    <input
                        type="string"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={onNameChange}
                        required
                    />
                </div>
                <FileInput
                    label="Лого"
                    onFilesAdded={onLogoChange}
                    accept="image/*"
                    required={promoCompany ? false: true}
                />
                <div className="text-right">
                    <button
                        type="button"
                        className="btn btn-primary rounded-pill mr-3"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success rounded-pill"
                    >
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
}
export default PromoCompanyForm;
