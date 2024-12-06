import React from 'react'
import PageHeading from '../../components/ui/PageHeading'
import Collapse from '../../components/ui/Collapse';
import { useNavigate } from 'react-router-dom';
import { GoTrash } from "react-icons/go";

const SettingsPage = () => {
    const [theme, setTheme] = React.useState(localStorage.getItem("theme") ?? "default");
    const navigate = useNavigate();

    React.useEffect(() => {
        localStorage.setItem('theme', theme!);
        findActiveTheme();
    }, [theme]);

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
          setTheme(target.value);
        }
      };
    const findActiveTheme = () => {
        const localTheme = localStorage.getItem('theme')
        document.querySelector('html')?.setAttribute('data-theme', localTheme!)
    };
    const handleAccountDeletion = () => {
        localStorage.clear();
        navigate('/login');
    }
  return (
    <div className='min-h-screen'>
        <PageHeading title='Settings'/>
        <div className='flex flex-col justify-start items-start'>
            <Collapse title='Theme'>
            <div className="join flex-wrap join-horizontal border-none my-2" >
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "default" ? "btn-active" : ""}`}
                        aria-label="Default"
                        value="default"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "black" ? "btn-active" : ""}`}
                        aria-label="Black"
                        value="black"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "light" ? "btn-active" : ""}`}
                        aria-label="Light"
                        value="light"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "valentine" ? "btn-active" : ""}`}
                        aria-label="Valentine"
                        value="valentine"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "coffee" ? "btn-active" : ""}`}
                        aria-label="Coffee"
                        value="coffee"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "aqua" ? "btn-active" : ""}`}
                        aria-label="Aqua"
                        value="aqua"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "synthwave" ? "btn-active" : ""}`}
                        aria-label="Synthwave"
                        value="synthwave"
                        onClick={handleClick}/>
                    <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme === "lemonade" ? "btn-active" : ""}`}
                        aria-label="Lemonade"
                        value="lemonade"
                        onClick={handleClick}/>
                    </div>
            </Collapse>
            <Collapse title='Author'>
                Ayberk Yavas <a className="link link-info"  href='https://ayberkyavas.com' target='_blank'>My Website</a>
            </Collapse>
            <Collapse title='Delete Account'>
                {/* You can open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn btn-error" onClick={()=>document.getElementById('account_deletion_model').showModal()} type='button'><GoTrash className='w-[1.3em] h-[1.3em]'/>Delete my account</button>
                <dialog id="account_deletion_model" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" type='submit'>✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Account Deletion!</h3>
                    <p className="py-4">We destroy all data about you and it cannot be restored. </p>
                    <button className="btn btn-outline btn-error" onClick={handleAccountDeletion}>yes, just delete stfu</button>
                </div>
                </dialog>
            </Collapse>
        </div>
    </div>
  )
}

export default SettingsPage