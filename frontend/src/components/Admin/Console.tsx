import { Box, Paper } from "@mantine/core";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminPanel from "./AdminPanel";
import AdminPromotion from "./AdminPromotion";

export default function AdminPage() {
  const { userInfo } = useSelector((state: any) => state.auth);
  const userIsAdmin = userInfo?.admin || false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userIsAdmin) {
      alert!("You are not an admin! Go away!");
      navigate("/");
    }
  }, []);

  return (
    <>
      <style>
        {` 
			.glass-effect {
				background: rgba(255, 255, 255, 0.13);
				border-radius: 20px;
				box-shadow: 0 5px 30px 20px rgba(0, 0, 0, 0.25);
				backdrop-filter: blur(5px);
				-webkit-backdrop-filter: blur(5px);
				border: 1px solid rgba(255, 255, 255, 0.25);
			}
		`}
      </style>

      <Box
        style={{
          height: "100vh",
          width: "100vw",
          color: "#fff",
          overflow: "hidden"
        }}
      >
        {/* svg wrapper */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            overflow: "hidden",
            zIndex: "0"
          }}
        >
          <svg
            id="visual"
            viewBox="0 0 900 600"
            width="100vw"
            height="100vh"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 121L13.7 116C27.3 111 54.7 101 82 97C109.3 93 136.7 95 163.8 89C191 83 218 69 245.2 72C272.3 75 299.7 95 327 106C354.3 117 381.7 119 409 112C436.3 105 463.7 89 491 88C518.3 87 545.7 101 573 105C600.3 109 627.7 103 654.8 91C682 79 709 61 736.2 55C763.3 49 790.7 55 818 66C845.3 77 872.7 93 886.3 101L900 109L900 0L886.3 0C872.7 0 845.3 0 818 0C790.7 0 763.3 0 736.2 0C709 0 682 0 654.8 0C627.7 0 600.3 0 573 0C545.7 0 518.3 0 491 0C463.7 0 436.3 0 409 0C381.7 0 354.3 0 327 0C299.7 0 272.3 0 245.2 0C218 0 191 0 163.8 0C136.7 0 109.3 0 82 0C54.7 0 27.3 0 13.7 0L0 0Z"
              fill="#1464dd"
            ></path>
            <path
              d="M0 367L13.7 353C27.3 339 54.7 311 82 290C109.3 269 136.7 255 163.8 259C191 263 218 285 245.2 278C272.3 271 299.7 235 327 243C354.3 251 381.7 303 409 295C436.3 287 463.7 219 491 194C518.3 169 545.7 187 573 210C600.3 233 627.7 261 654.8 264C682 267 709 245 736.2 246C763.3 247 790.7 271 818 276C845.3 281 872.7 267 886.3 260L900 253L900 107L886.3 99C872.7 91 845.3 75 818 64C790.7 53 763.3 47 736.2 53C709 59 682 77 654.8 89C627.7 101 600.3 107 573 103C545.7 99 518.3 85 491 86C463.7 87 436.3 103 409 110C381.7 117 354.3 115 327 104C299.7 93 272.3 73 245.2 70C218 67 191 81 163.8 87C136.7 93 109.3 91 82 95C54.7 99 27.3 109 13.7 114L0 119Z"
              fill="#1550b4"
            ></path>
            <path
              d="M0 427L13.7 426C27.3 425 54.7 423 82 414C109.3 405 136.7 389 163.8 379C191 369 218 365 245.2 353C272.3 341 299.7 321 327 330C354.3 339 381.7 377 409 370C436.3 363 463.7 311 491 293C518.3 275 545.7 291 573 317C600.3 343 627.7 379 654.8 384C682 389 709 363 736.2 359C763.3 355 790.7 373 818 370C845.3 367 872.7 343 886.3 331L900 319L900 251L886.3 258C872.7 265 845.3 279 818 274C790.7 269 763.3 245 736.2 244C709 243 682 265 654.8 262C627.7 259 600.3 231 573 208C545.7 185 518.3 167 491 192C463.7 217 436.3 285 409 293C381.7 301 354.3 249 327 241C299.7 233 272.3 269 245.2 276C218 283 191 261 163.8 257C136.7 253 109.3 267 82 288C54.7 309 27.3 337 13.7 351L0 365Z"
              fill="#133d8c"
            ></path>
            <path
              d="M0 487L13.7 489C27.3 491 54.7 495 82 491C109.3 487 136.7 475 163.8 467C191 459 218 455 245.2 444C272.3 433 299.7 415 327 424C354.3 433 381.7 469 409 462C436.3 455 463.7 405 491 388C518.3 371 545.7 387 573 410C600.3 433 627.7 463 654.8 465C682 467 709 441 736.2 440C763.3 439 790.7 463 818 460C845.3 457 872.7 427 886.3 412L900 397L900 317L886.3 329C872.7 341 845.3 365 818 368C790.7 371 763.3 353 736.2 357C709 361 682 387 654.8 382C627.7 377 600.3 341 573 315C545.7 289 518.3 273 491 291C463.7 309 436.3 361 409 368C381.7 375 354.3 337 327 328C299.7 319 272.3 339 245.2 351C218 363 191 367 163.8 377C136.7 387 109.3 403 82 412C54.7 421 27.3 423 13.7 424L0 425Z"
              fill="#0e2b67"
            ></path>
            <path
              d="M0 601L13.7 601C27.3 601 54.7 601 82 601C109.3 601 136.7 601 163.8 601C191 601 218 601 245.2 601C272.3 601 299.7 601 327 601C354.3 601 381.7 601 409 601C436.3 601 463.7 601 491 601C518.3 601 545.7 601 573 601C600.3 601 627.7 601 654.8 601C682 601 709 601 736.2 601C763.3 601 790.7 601 818 601C845.3 601 872.7 601 886.3 601L900 601L900 395L886.3 410C872.7 425 845.3 455 818 458C790.7 461 763.3 437 736.2 438C709 439 682 465 654.8 463C627.7 461 600.3 431 573 408C545.7 385 518.3 369 491 386C463.7 403 436.3 453 409 460C381.7 467 354.3 431 327 422C299.7 413 272.3 431 245.2 442C218 453 191 457 163.8 465C136.7 473 109.3 485 82 489C54.7 493 27.3 489 13.7 487L0 485Z"
              fill="#081a44"
            ></path>
          </svg>
        </div>

        <div
          className="glass-effect"
          style={{
            width: "57%",
            margin: "auto",
            padding: "25px",
            position: "relative",
            marginTop: "11.5vh",
            zIndex: "1"
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "50px",
              marginBottom: "2vh"
            }}
          >
            Admin Panel
          </h2>
          <div
            className="admin-panels"
            style={{
              width: "100%",
              display: "flex",
              gap: "25px",
              margin: "auto",
              padding: "25px"
            }}
          >
            <Paper
              shadow="md"
              p={50}
              radius="md"
              withBorder
              style={{
                flex: "1",
                background: "#23272A",
                minWidth: "0",
                color: "#fff"
              }}
            >
              <AdminPanel />
            </Paper>
            <Paper
              shadow="md"
              p={50}
              radius="md"
              withBorder
              style={{
                flex: "1",
                minWidth: "0",
                background: "#23272A",
                color: "#fff"
              }}
            >
              <AdminPromotion />
            </Paper>
          </div>
          

        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
          <Link style={{color: "white", background: "black", padding: "10px", fontWeight: "bold"}} to="/cco">Create Course Offering</Link>
        </div>
        </div>
      </Box>
    </>
  );
}
