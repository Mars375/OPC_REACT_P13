import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { fetchTransactionByIdThunk } from '../redux/transactionSlice';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TransactionDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, status, error } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionByIdThunk(transactionId));
    }
  }, [dispatch, transactionId]);

  if (status === 'failed') {
    return (
      <div
        className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4 text-sm text-red-700"
        role="alert"
      >
        <FontAwesomeIcon
          icon="exclamation-circle"
          className="mr-3 inline h-5 w-5"
        />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <div className="container mx-auto p-4">
        {status === 'loading' ? (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid  border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-start p-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary transition-colors duration-200 hover:text-[#00A96B]"
              >
                <span className="text-lg font-medium">Retour</span>
              </button>
            </div>
            <h1 className="mb-4 text-2xl font-bold">Transaction Details</h1>
            {transaction && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="calendar-alt"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Date: {transaction.date}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="dollar-sign"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Amount: {transaction.amount}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="tag"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Category: {transaction.category}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="sticky-note"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Notes: {transaction.notes}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="store"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Merchant: {transaction.merchant}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="map-marker-alt"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Location: {transaction.location}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="info-circle"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Status: {transaction.status}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="money-bill-wave"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Currency: {transaction.currency}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon="credit-card"
                      className="mr-2 text-gray-500"
                    />
                    <p className="text-lg font-medium">
                      Payment Method: {transaction.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailPage;
