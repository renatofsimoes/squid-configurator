import Button from "./Button";
import "./DirectiveOrValueChoiceForm.css"

const DirectiveOrValueChoiceForm = ({ aclName, onChooseDirective, onChooseValue, onBack }) => (
    <div className="forms">
        <div id="choice-form">
            <h2>{aclName}</h2>
            <h3>O que você deseja adicionar?</h3>
            <div id="choice-btns">
                <Button className="dbtn" text="Diretiva" onClick={onChooseDirective} />
                <Button className="vbtn" text="Valor" onClick={onChooseValue} />
            </div>
            <Button className="back-btn" iClass="fas fa-arrow-left" onClick={onBack} />
        </div>
    </div>
);
export default DirectiveOrValueChoiceForm;