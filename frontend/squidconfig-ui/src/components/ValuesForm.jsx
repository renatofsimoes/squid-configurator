import Button from "./Button";

const ValuesForm = ({ aclName, onBack }) => (
    <div className="values-form">
        <h2>Adicionar Valor</h2>
        <h3>ACL: {aclName}</h3>
        <p>[Formulário de valores ainda em construção]</p>
        <Button text="Voltar" onClick={onBack} />
    </div>
);
export default ValuesForm;