import Button from "./Button";
import "./DirectiveOrValueChoiceForm.css";

const DirectiveOrValueChoiceForm = ({
  acl,
  mode = "add",
  onChooseDirective,
  onChooseValue,
  onBack,
}) => {
  if (!acl) return null;

  return (
    <div className="forms">
      <div id="choice-form">
        <h2>{acl.name}</h2>
        <h3>
          {mode === "remove"
            ? "O que deseja remover?"
            : "O que deseja adicionar?"}
        </h3>

        <div id="choice-btns">
          <Button
            className="dbtn"
            text="Diretiva"
            onClick={onChooseDirective}
          />
          <Button className="vbtn" text="Valor" onClick={onChooseValue} />
        </div>

        <Button
          className="back-btn"
          iClass="fas fa-arrow-left"
          onClick={onBack}
        />
      </div>
    </div>
  );
};

export default DirectiveOrValueChoiceForm;
