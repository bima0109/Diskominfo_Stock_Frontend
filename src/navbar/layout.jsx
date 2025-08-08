import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import iconMasuk from "../assets/masuk.png";
import iconHabis from "../assets/habis.png";
import iconMasih from "../assets/masih.png";

// === LinkSidebar Component ===
const LinkSidebar = () => {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.nama;

  const [showRekapSubmenu, setShowRekapSubmenu] = useState(false);
  const toggleRekap = () => setShowRekapSubmenu(!showRekapSubmenu);

  return (
    <div className="d-flex flex-column gap-3">
      {role === "SUPERADMIN" && (
        <>
          <Link
            to="index-stok-opname/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
              alt=""
              width="30"
            />
            Data Stock Opname
          </Link>

          <Link
            to="bidang/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
            />
            Bidang
          </Link>

          <Link
            to="user/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
            />
            Manajemen User
          </Link>

          {/* Rekap menu */}
          <div
            onClick={toggleRekap}
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center gap-2 text-white link-side mt-2"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13760&format=png&color=000000"
              alt=""
              width="30"
            />
            Rekap
          </div>

          {/* Submenu Rekap */}
          {showRekapSubmenu && (
            <div className="ps-4 d-flex flex-column gap-1">
              <Link
                to="masuk/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconMasuk}
                  alt="Barang Masuk"
                  width="20"
                  height="20"
                />
                Barang Masuk
              </Link>

              <Link
                to="habis/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconHabis}
                  alt="Barang Habis"
                  width="20"
                  height="20"
                />
                Barang Habis
              </Link>

              <Link
                to="masih/"
                className="text-white link-side d-flex align-items-center gap-2"
              >
                <img
                  src={iconMasih}
                  alt="Barang Masih"
                  width="20"
                  height="20"
                />
                Barang Masih
              </Link>
            </div>
          )}
        </>
      )}

      {role === "ADMIN" && (
        <>
          <Link
            to="stock-in/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAapJREFUSEvt1s+LTnEUx/HXFKVGykbKsGDBxk7MampqNmNnQyksLaSkZCHZWFhYzCxnNQuNFUn5A5hsaAZLCguEjSILP1LcU99H03junfPcW0+Us3q695z7fs7n+z0/RgzZRobM89cCd2JHQo13eNbkl8lwLx5hXQL4E+N4WOfbBNyCKziM0QSs5/INN3ERL1fH1QG34x5uVNANOD0A8Dqe4iSmyu/f4XXA23iCS7hQyXl5AOAszuAUjmBiZWw/4EZ8wgEsYU91JgexKQENOefxHmN4jVDrTS+2H3B3kWFz9U8/JiBNLl8wjbv/gXHLepJOlsuTVTcuza3i3ErSreXiZIFRe6+6ALOgfn6tMozCj3aVtWV87pLhUSxkaaXo4xzDWmU4AOsP138DuAvHGtJ8gWs171tlGD012lOdRfub6QKMuovJvQ1vOxzgenzFPjxu6qXx7gNOVM53OgBDmftleH9fC3iumtbHcQjPW0BDnRjei1VpnF8ZXzeA4/lVnC1rQsy1rMVqEjN0rmwKPzLAnk/ovx/xkazFccQS9aBfQGZry4JSfkMH/gL0K2od+TqpuwAAAABJRU5ErkJggg=="
              alt=""
              width="30"
            />
            Stock dan Input
          </Link>
          <Link
            to="draft-pengajuan/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAQdJREFUSEvt1b0uREEYh/HfXoeEaBQUohdqHRegFLVEomN9tdtTuAyUNnsLCmoSClQa2cZOMgWymY/k5BRrTzUn+c88M8953zkdLT+dlnmmwMaN/2+lS9jHC3p4a8JvSukAqxFygqM43sJyATxs9OJvLgW8w/oY4NmPjaS4T9iuAa7gCvfYa0NpgbX6SK4tZvExKp7P+qXHz0gBj3GIL4RCuWkCmgI+YiFCLkftsRvH19gogIeiCYZ+PSlgaINuPOEmbuPMOcwXAF/xUAMM2Va/YcEh6iMppZN/tfWxFqWdxhYJrzuYKZA5xHlN0SziAM/xb/FeAMlGcjdNdoHawBRYayybn3yl32TTLB02xL32AAAAAElFTkSuQmCC"
              alt=""
              width="30"
            />
            Draft Pengajuan
          </Link>
          <Link
            to="pengajuan/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAeFJREFUSEvF1svLTlEUx/HPqzA0kCJlJpdyzUTJRDJVBkoZuZQMpES5TRgxwUQGRnpzmZgghOSSIvIHuIXkD3DP7azaj55257xnP8d7OcOz11rftfZev7X3kHH+hsaZZ8KBkzATH8aq8rzCjTiAxX3ASGIJphUk8RnP8KvJNgduxkHMSw6zcQvzC2A9k9dYi5d1Pm3A05iLdVnWF/EOe7KgES/WfmJTF+D1KtuHOJI5NwHDbDt2YFkX4E3cw9HM+RLe1lQYZluxC4u6ALtUuA07sbQL8FTVNKuwPlXUi3GhquR9TYWzENXH+XY6wwhwZ8AufZGa7FWXCsNnUB0+xe+uOhxAfmWmbTqMKHOwoXDS5NQ3SZdfewttwJW4jdimpnEVMVYnm08ZcTomYzm+xFob8Hwy3DLChk3B9yT055ldnH/odV81sYZLgDdwv0b4/XGjgh8NwLC7i6s4XgJsmjT9wKn41gK8hmMlwCvpujnccUvD7VGl4xgUJ0uA+7EbcWs0aSvO6RDO4GOW2Iw0yFekxFubJrbrRNXaC8pUVmt1FudKZfEfnHrXXBZrqufE5WoAL0zDecyB0eIP0l32eJRofyot78WTuqaJfwGNUTbIO2ak3AL4r6Em/F06SrvYHOYv/vttHdylo1cAAAAASUVORK5CYII="
              alt=""
              width="30"
            />
            Daftar Pengajuan
          </Link>
          <Link
            to="dashboard-admin/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAcBJREFUSEvN1s+LjVEYwPHPKBZix0JK+VEsiIYsUPwBYiMkSrPgP7CysCM2ykpIkWJDNpKQxSymEJGkqNkJJTtMwnnqTN37eu/tnXNqzNnct9t5nu9znt8jZvmMzDLPnAEuwCYsrPDAT7zAj14dbS/cjtv4hK8VwMVYjf14MK2nCVyGt9iN8QrYtOgoHmML3sefTeBenMfKAtgB3MxyB3Erfz/DRVxqAx7BSawtAIbx4ZV5yYXb8CfreIJ7KR/OtgEP4wKWJvCvAmjIxfmSf8OID+n7FK4NAl7HDVwuADZFwrWHsALfBgFP4yH2YVElNIw/h9eDsrQmhr22bcCrXMffh9XhfweeSPUTiRS1OexEcT/KGT6B4hcexfqOcVyCiP+7GmBH1j/Xil8YmqKRdz1T+WIx8C72dKVhDFdrXBqdY/kMgC9rXzgDVt/VYpfuxJoh1MlcDs0rxcBo5Mcxv7c95Rj9xhUcazGoMzAK+Ezq7KtKfZnlNuNpzvC+qdMcwOvwJs2vrXheAY0hvivvRX1q2naamMwxVkqBsXhtTAtUbA/3m0YPWhNjYu8o3No+J+CdFPuPbR6aM3tpRfiGi/4FxT5fHeFPWn8AAAAASUVORK5CYII="
              alt=""
              width="30"
            />
            Rekap Tahunan (Beta)
          </Link>
        </>
      )}

      {role === "PPTKSEKRETARIAT" && (
        <>
          <Link
            to="stock-pptk/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAapJREFUSEvt1s+LTnEUx/HXFKVGykbKsGDBxk7MampqNmNnQyksLaSkZCHZWFhYzCxnNQuNFUn5A5hsaAZLCguEjSILP1LcU99H03junfPcW0+Us3q695z7fs7n+z0/RgzZRobM89cCd2JHQo13eNbkl8lwLx5hXQL4E+N4WOfbBNyCKziM0QSs5/INN3ERL1fH1QG34x5uVNANOD0A8Dqe4iSmyu/f4XXA23iCS7hQyXl5AOAszuAUjmBiZWw/4EZ8wgEsYU91JgexKQENOefxHmN4jVDrTS+2H3B3kWFz9U8/JiBNLl8wjbv/gXHLepJOlsuTVTcuza3i3ErSreXiZIFRe6+6ALOgfn6tMozCj3aVtWV87pLhUSxkaaXo4xzDWmU4AOsP138DuAvHGtJ8gWs171tlGD012lOdRfub6QKMuovJvQ1vOxzgenzFPjxu6qXx7gNOVM53OgBDmftleH9fC3iumtbHcQjPW0BDnRjei1VpnF8ZXzeA4/lVnC1rQsy1rMVqEjN0rmwKPzLAnk/ovx/xkazFccQS9aBfQGZry4JSfkMH/gL0K2od+TqpuwAAAABJRU5ErkJggg=="
              alt=""
              width="30"
            />
            Stok Opname
          </Link>
          <Link
            to="verifikasi-pptk/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAS1JREFUSEvt1L8rxVEYx/HXJbJJ/gAMZkUpFmU0GKwWZTIrWZRSJj8yWkz+BUlMZPIXyGjAqixS3KeOum73q/Ptft1B90yn0+c87+f5nOc5NR1etQ7zdIGVO9619NvSSSxjvV2PcyydwlUdtI2jqoF9GK1X85ACT+MSO9hLZyMYKwH+xC0+4k5zhbO4wBLe0j4q228AnGGhBDCkoT9vBYyztWTdO7ZwWDL4r/KiN1ytgwZxUCWsqMKqGT/i5XRppQnkAnswjvt26TnA0JwgxmH+r4G9OEXMY4zMS9XAGWxiBa8JFj/NHJ4SbDfBc9kx+Bu4a9Wlw7hJsEdMNMHiziLib81dATzGc9FYBPQaA1XZ2JhZUdMMob+KN2u2IadLc63L0nWBWTaVEf1/S78AIpEoHc638QMAAAAASUVORK5CYII="
              alt=""
              width="30"
            />
            Verifikasi
          </Link>
          <Link
            to="history-pptk/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAmNJREFUSEvV1kmojWEcx/HPRWZJpg0iCyFFkQVCFAvTAslQYqNs7FigrCwUsaIMZSoUWShZiIwZIkmisFAKReYpvP/bc+p473nPfe+9dcpbb53h/3++z3/6PU+TBj9NDeb5L4A9MASD8AbP8bNspspG2B9rsBTj8TK9AzA8+/0RLmBn2kQhPw+M7yPwrMpjNXbhJo7gVC6izpiKFViGLdhdRMwDI4IDmIdr6fOEbNfrcaVE2qbgaOZ/B6vwLe+TB65MUYThbXTHbHwoAauY9E1ZCJ8l+FPtWwSs2KzFwQLYcpzErxr/98QlnMH2esBIw+Eqgx+YnupX7RdRvMforG6PCzYUpbiReuJVxSYfYRT/MjpVLRLfZ+QWLQMMl/O4n9VyUxGwbKnKAhdhT1aWYY0CdkudOgpPAlp28PORl40w/EKJNqYGawHsh0lJNeqlt2u2yNdcrSv2G3KDfw97sa9WhAuSqowsUcyxGFjD7i4+Vv0eqrUZx2sBx+AheqUISnDrmsQ6MT4zMwG5WgvYBW+TLp7rKC2b37k4nWUtat58otRqmlCWUIoQ4o4+J1K2Qpubn1rAaJpbqXlChNv7jMMDTKuks95YHMLE9H5vBzEyFJt9ioXV/kVzGDm/nmQp9PV3G6B9cBZxaMdx9akMMGziGnERrxHH1osS0EhjtP+XTLjnpA79x601pYm2jvTOz6Lcmm1iP97lwHFmRp0WI46zY1hXNFatAStrz8oabBsmpzR/RlwthqY3VCeuHjvS/aYwGWWBlQV6p+6Ne8/gNLOhlTHULa4TtahtBZYoY32ThgP/Anyacx2+gMmVAAAAAElFTkSuQmCC"
              alt=""
              width="30"
            />
            History
          </Link>
        </>
      )}

      {role === "KABID" && (
        <>
          <Link
            to="stock-kabid/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAapJREFUSEvt1s+LTnEUx/HXFKVGykbKsGDBxk7MampqNmNnQyksLaSkZCHZWFhYzCxnNQuNFUn5A5hsaAZLCguEjSILP1LcU99H03junfPcW0+Us3q695z7fs7n+z0/RgzZRobM89cCd2JHQo13eNbkl8lwLx5hXQL4E+N4WOfbBNyCKziM0QSs5/INN3ERL1fH1QG34x5uVNANOD0A8Dqe4iSmyu/f4XXA23iCS7hQyXl5AOAszuAUjmBiZWw/4EZ8wgEsYU91JgexKQENOefxHmN4jVDrTS+2H3B3kWFz9U8/JiBNLl8wjbv/gXHLepJOlsuTVTcuza3i3ErSreXiZIFRe6+6ALOgfn6tMozCj3aVtWV87pLhUSxkaaXo4xzDWmU4AOsP138DuAvHGtJ8gWs171tlGD012lOdRfub6QKMuovJvQ1vOxzgenzFPjxu6qXx7gNOVM53OgBDmftleH9fC3iumtbHcQjPW0BDnRjei1VpnF8ZXzeA4/lVnC1rQsy1rMVqEjN0rmwKPzLAnk/ovx/xkazFccQS9aBfQGZry4JSfkMH/gL0K2od+TqpuwAAAABJRU5ErkJggg=="
              alt=""
              width="30"
            />
            Stok Opname
          </Link>
          <Link
            to="verifikasi-kabid/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAS1JREFUSEvt1L8rxVEYx/HXJbJJ/gAMZkUpFmU0GKwWZTIrWZRSJj8yWkz+BUlMZPIXyGjAqixS3KeOum73q/Ptft1B90yn0+c87+f5nOc5NR1etQ7zdIGVO9619NvSSSxjvV2PcyydwlUdtI2jqoF9GK1X85ACT+MSO9hLZyMYKwH+xC0+4k5zhbO4wBLe0j4q228AnGGhBDCkoT9vBYyztWTdO7ZwWDL4r/KiN1ytgwZxUCWsqMKqGT/i5XRppQnkAnswjvt26TnA0JwgxmH+r4G9OEXMY4zMS9XAGWxiBa8JFj/NHJ4SbDfBc9kx+Bu4a9Wlw7hJsEdMNMHiziLib81dATzGc9FYBPQaA1XZ2JhZUdMMob+KN2u2IadLc63L0nWBWTaVEf1/S78AIpEoHc638QMAAAAASUVORK5CYII="
              alt=""
              width="30"
            />
            Verifikasi
          </Link>
          <Link
            to="history-kabid/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAmNJREFUSEvV1kmojWEcx/HPRWZJpg0iCyFFkQVCFAvTAslQYqNs7FigrCwUsaIMZSoUWShZiIwZIkmisFAKReYpvP/bc+p473nPfe+9dcpbb53h/3++z3/6PU+TBj9NDeb5L4A9MASD8AbP8bNspspG2B9rsBTj8TK9AzA8+/0RLmBn2kQhPw+M7yPwrMpjNXbhJo7gVC6izpiKFViGLdhdRMwDI4IDmIdr6fOEbNfrcaVE2qbgaOZ/B6vwLe+TB65MUYThbXTHbHwoAauY9E1ZCJ8l+FPtWwSs2KzFwQLYcpzErxr/98QlnMH2esBIw+Eqgx+YnupX7RdRvMforG6PCzYUpbiReuJVxSYfYRT/MjpVLRLfZ+QWLQMMl/O4n9VyUxGwbKnKAhdhT1aWYY0CdkudOgpPAlp28PORl40w/EKJNqYGawHsh0lJNeqlt2u2yNdcrSv2G3KDfw97sa9WhAuSqowsUcyxGFjD7i4+Vv0eqrUZx2sBx+AheqUISnDrmsQ6MT4zMwG5WgvYBW+TLp7rKC2b37k4nWUtat58otRqmlCWUIoQ4o4+J1K2Qpubn1rAaJpbqXlChNv7jMMDTKuks95YHMLE9H5vBzEyFJt9ioXV/kVzGDm/nmQp9PV3G6B9cBZxaMdx9akMMGziGnERrxHH1osS0EhjtP+XTLjnpA79x601pYm2jvTOz6Lcmm1iP97lwHFmRp0WI46zY1hXNFatAStrz8oabBsmpzR/RlwthqY3VCeuHjvS/aYwGWWBlQV6p+6Ne8/gNLOhlTHULa4TtahtBZYoY32ThgP/Anyacx2+gMmVAAAAAElFTkSuQmCC"
              alt=""
              width="30"
            />
            History
          </Link>
        </>
      )}

      {role === "SEKRETARIS" && (
        <>
          <Link
            to="stock-sekre/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAapJREFUSEvt1s+LTnEUx/HXFKVGykbKsGDBxk7MampqNmNnQyksLaSkZCHZWFhYzCxnNQuNFUn5A5hsaAZLCguEjSILP1LcU99H03junfPcW0+Us3q695z7fs7n+z0/RgzZRobM89cCd2JHQo13eNbkl8lwLx5hXQL4E+N4WOfbBNyCKziM0QSs5/INN3ERL1fH1QG34x5uVNANOD0A8Dqe4iSmyu/f4XXA23iCS7hQyXl5AOAszuAUjmBiZWw/4EZ8wgEsYU91JgexKQENOefxHmN4jVDrTS+2H3B3kWFz9U8/JiBNLl8wjbv/gXHLepJOlsuTVTcuza3i3ErSreXiZIFRe6+6ALOgfn6tMozCj3aVtWV87pLhUSxkaaXo4xzDWmU4AOsP138DuAvHGtJ8gWs171tlGD012lOdRfub6QKMuovJvQ1vOxzgenzFPjxu6qXx7gNOVM53OgBDmftleH9fC3iumtbHcQjPW0BDnRjei1VpnF8ZXzeA4/lVnC1rQsy1rMVqEjN0rmwKPzLAnk/ovx/xkazFccQS9aBfQGZry4JSfkMH/gL0K2od+TqpuwAAAABJRU5ErkJggg=="
              alt=""
              width="30"
            />
            Stok Opname
          </Link>
          <Link
            to="verifikasi-sekre/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAS1JREFUSEvt1L8rxVEYx/HXJbJJ/gAMZkUpFmU0GKwWZTIrWZRSJj8yWkz+BUlMZPIXyGjAqixS3KeOum73q/Ptft1B90yn0+c87+f5nOc5NR1etQ7zdIGVO9619NvSSSxjvV2PcyydwlUdtI2jqoF9GK1X85ACT+MSO9hLZyMYKwH+xC0+4k5zhbO4wBLe0j4q228AnGGhBDCkoT9vBYyztWTdO7ZwWDL4r/KiN1ytgwZxUCWsqMKqGT/i5XRppQnkAnswjvt26TnA0JwgxmH+r4G9OEXMY4zMS9XAGWxiBa8JFj/NHJ4SbDfBc9kx+Bu4a9Wlw7hJsEdMNMHiziLib81dATzGc9FYBPQaA1XZ2JhZUdMMob+KN2u2IadLc63L0nWBWTaVEf1/S78AIpEoHc638QMAAAAASUVORK5CYII="
              alt=""
              width="30"
            />
            Verifikasi
          </Link>
          <Link
            to="history-sekre/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAmNJREFUSEvV1kmojWEcx/HPRWZJpg0iCyFFkQVCFAvTAslQYqNs7FigrCwUsaIMZSoUWShZiIwZIkmisFAKReYpvP/bc+p473nPfe+9dcpbb53h/3++z3/6PU+TBj9NDeb5L4A9MASD8AbP8bNspspG2B9rsBTj8TK9AzA8+/0RLmBn2kQhPw+M7yPwrMpjNXbhJo7gVC6izpiKFViGLdhdRMwDI4IDmIdr6fOEbNfrcaVE2qbgaOZ/B6vwLe+TB65MUYThbXTHbHwoAauY9E1ZCJ8l+FPtWwSs2KzFwQLYcpzErxr/98QlnMH2esBIw+Eqgx+YnupX7RdRvMforG6PCzYUpbiReuJVxSYfYRT/MjpVLRLfZ+QWLQMMl/O4n9VyUxGwbKnKAhdhT1aWYY0CdkudOgpPAlp28PORl40w/EKJNqYGawHsh0lJNeqlt2u2yNdcrSv2G3KDfw97sa9WhAuSqowsUcyxGFjD7i4+Vv0eqrUZx2sBx+AheqUISnDrmsQ6MT4zMwG5WgvYBW+TLp7rKC2b37k4nWUtat58otRqmlCWUIoQ4o4+J1K2Qpubn1rAaJpbqXlChNv7jMMDTKuks95YHMLE9H5vBzEyFJt9ioXV/kVzGDm/nmQp9PV3G6B9cBZxaMdx9akMMGziGnERrxHH1osS0EhjtP+XTLjnpA79x601pYm2jvTOz6Lcmm1iP97lwHFmRp0WI46zY1hXNFatAStrz8oabBsmpzR/RlwthqY3VCeuHjvS/aYwGWWBlQV6p+6Ne8/gNLOhlTHULa4TtahtBZYoY32ThgP/Anyacx2+gMmVAAAAAElFTkSuQmCC"
              alt=""
              width="30"
            />
            History
          </Link>
        </>
      )}

      <div className="mt-auto p-2">
        <Link
          to="/user/profile"
          className="d-flex align-items-center gap-2 text-white link-side"
        >
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAhlJREFUSEvt1surzWEUxvHPESmREIpyKRIKUyJMXFNmSAYuKeQyOQYuGSiFcokZmSAiykQI+Q9Q5JLbgEgUcin3d9W7T9v22/vsfc7ujM47/a31fvd617OetVt08WnpYp5uYC+MxZAGnv4j7uN7UU6tJ12IkxjQAKwU+hUrca4ytxpwPi7jAI7ieQPQeI2N2IFlOFueWw34DGewvQFQZWgrtmJwe8A++JKA4/C4ADgIczASL3Edbwri+uMDxuBp6XtRhQF6mHsXCeVnOs4jLruH8ekVfqT4pbhWAP2GaM+tjgCHZ8hh7Mkq7IlN2I3JeFIB7RRwGxZhakElV3E396z8c6eAp/Au9WVLATDENQPzmlnhwWwAywuAhzA0j0HTKlycFBdVhvO8Lrs1BPQIO3GsmRXGXTHEM3EEdzAJ67OVLcCfZgN7JHWGeFZgBF7lH7ErVfir2WPREdOpS6XRo3CYMO3ywe+LzcmQJ2AYbbs0XOZBio/5rDSKcKxYAjUHvwg4LfXrIn7jZraqUr9GpQtnoV8CL8lWV3qNuoCR+Amj8SJ75m1cwoY03LF6Kk9v7McqTMmOU+jJ1bZFyPwE9uJ48s+JebB/1mhk3HUjqfZt9tZ12QIHlqu3GnAurmAf1qatsAYX6lDN7JwX1YaawyRizbWd9jb+6bwZ6mD9E/IZqxvZ+KXsjvyneZ/XW6yt/07338RGe9du/F9JWIYdg3wfrwAAAABJRU5ErkJggg=="
            alt="Profile"
            width="30"
          />
          Profile
        </Link>
      </div>
    </div>
  );
};

// === Sidebar Component ===
const Sidebar = () => {
  const location = useLocation();

  useEffect(() => {
    const offcanvasEl = document.getElementById("staticBackdrop");
    if (offcanvasEl) {
      bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide();
    }
    setTimeout(() => {
      document
        .querySelectorAll(".offcanvas-backdrop")
        .forEach((el) => el.remove());
    }, 200);
  }, [location]);

  useEffect(() => {
    const el = document.getElementById("staticBackdrop");
    if (el) bootstrap.Offcanvas.getOrCreateInstance(el);
  }, []);

  return (
    <>
      <button
        className="btn z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#staticBackdrop"
      >
        <img
          src="https://img.icons8.com/?size=100&id=8113&format=png&color=FFFFFF"
          alt=""
          width="30"
        />
      </button>
      <div
        className="offcanvas offcanvas-start"
        style={{ backgroundColor: "#667eea" }}
        data-bs-backdrop="static"
        id="staticBackdrop"
      >
        <div className="offcanvas-header">
          <div className="fw-bold fs-2 text-white">SiSEKRUP</div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <LinkSidebar />
        </div>
      </div>
    </>
  );
};

// === Navbar Component ===
const Navbar = () => (
  <nav className="navbar" style={{ backgroundColor: "#667eea" }}>
    <div className="container-fluid">
      <Sidebar />
      <Link
        to="/"
        className="d-flex align-items-center gap-1 text-white text-decoration-none"
      >
        <img
          src="https://img.icons8.com/?size=100&id=24337&format=png&color=FFFFFF"
          alt="Logout"
          width="30"
        />
        Log out
      </Link>
    </div>
  </nav>
);

// === Layout Component ===
const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.classList.remove(
      "offcanvas-backdrop",
      "modal-open",
      "overflow-hidden"
    );
  }, [location]);

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            width: 100vw;
            overflow-x: hidden;
          }

          #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          a {
            text-decoration: none;
            padding: 5px;
          }

          .link-side:hover {
            background-color: #764ba2;
            filter: brightness(85%);
            border-radius: 2px;
          }

          .offcanvas-backdrop {
            z-index: 1040;
          }
        `}
      </style>
      <Navbar key={location.pathname} />
      <Outlet />
    </>
  );
};

export default Layout;
