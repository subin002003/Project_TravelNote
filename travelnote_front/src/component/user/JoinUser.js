import "../common/default.css";
import "./user.css";
const JoinUser = () => {
  return (
    <section className="section">
      <div className="page-title">
        <h1>회원가입</h1>
      </div>

      <div className="join-frm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="select-box">
            <label>
              <input type="radio" name="category" /> 유저
            </label>
            <label>
              <input type="radio" name="category" /> 여행사
            </label>
          </div>
          <div className="logo-box">
            <img src=""></img>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JoinUser;
