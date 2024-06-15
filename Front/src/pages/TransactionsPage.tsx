import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  fetchTransactionsThunk,
  updateTransactionThunk,
} from '../redux/transactionSlice';
import { AppDispatch } from '../redux/store';

/**
 * TransactionsPage component displays the list of transactions for a specific account.
 * It allows the user to view and edit transaction details and handles various states such as loading and error.
 *
 * @component
 * @example
 * return (
 *   <TransactionsPage />
 * )
 */
const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts, error: accountsError } = useSelector(
    (state: RootState) => state.account
  );
  const {
    transactions,
    status,
    error: transactionsError,
  } = useSelector((state: RootState) => state.transaction);
  const { profile } = useSelector((state: RootState) => state.profile);

  // Find the account by accountId
  const account = accounts.find((acc) => acc.accountId === accountId);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [editTransactionId, setEditTransactionId] = useState<string | null>(
    null
  );
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch transactions when accountId changes
  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactionsThunk(accountId));
    }
  }, [dispatch, accountId]);

  // Toggle the expanded state of a transaction
  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle edit button click
  const handleEdit = (
    transactionId: string,
    currentCategory: string,
    currentNotes: string
  ) => {
    setEditTransactionId(transactionId);
    setCategory(currentCategory);
    setNotes(currentNotes);
  };

  // Handle save button click
  const handleSave = (transactionId: string) => {
    if (profile && account) {
      dispatch(
        updateTransactionThunk({
          accountId: account.accountId,
          transactionId,
          updates: { category, notes },
        })
      );
      setEditTransactionId(null);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditTransactionId(null);
  };

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <>
        <div className="flex items-center justify-start p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-secondary transition-colors duration-200 hover:text-[#00A96B]"
          >
            <FontAwesomeIcon icon="arrow-left" className="mr-2" />
            <span className="text-lg font-medium">Retour</span>
          </button>
        </div>
        {accountsError ? (
          <div
            className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            <FontAwesomeIcon
              icon="exclamation-circle"
              className="mr-3 inline h-5 w-5"
            />
            <span className="font-medium">{accountsError}</span>
          </div>
        ) : transactionsError ? (
          <div
            className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            <FontAwesomeIcon
              icon="exclamation-circle"
              className="mr-3 inline h-5 w-5"
            />
            <span className="font-medium">{transactionsError}</span>
          </div>
        ) : account ? (
          <>
            <header className="border-2 border-gray-200 bg-white p-6 text-center">
              <h1 className="text-xl font-bold">{account.title}</h1>
              <p className="my-2 text-4xl font-bold">{account.amount}</p>
              <p className="text-gray-500">Available Balance</p>
            </header>
            <section className="relative mt-6 flex-1 p-12">
              {status === 'loading' ? (
                <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid  border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <header className="flex py-2 font-semibold text-black">
                    <p className="w-1/12"></p>
                    <p className="w-2/12">DATE</p>
                    <p className="w-4/12">DESCRIPTION</p>
                    <p className="w-2/12">AMOUNT</p>
                    <p className="w-2/12">BALANCE</p>
                  </header>
                  {transactions.map((transaction, index) => (
                    <article
                      key={transaction.transactionId}
                      className="border border-gray-400 bg-white text-black"
                    >
                      <div
                        onClick={() => toggleExpand(index)}
                        className="flex cursor-pointer items-center py-6"
                      >
                        <div
                          className="w-1/12 transform transition-transform duration-300 ease-in-out"
                          style={{
                            transform: expandedIndices.includes(index)
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                          }}
                        >
                          <FontAwesomeIcon icon="chevron-down" />
                        </div>
                        <div className="w-2/12">{transaction.date}</div>
                        <div className="w-4/12">{transaction.description}</div>
                        <div className="w-2/12">{transaction.amount}</div>
                        <div className="w-2/12">{transaction.balance}</div>

                        <Link to={`${transaction.transactionId}`}>
                          <FontAwesomeIcon
                            icon="search"
                            className="ml-4 cursor-pointer text-gray-500"
                          />
                        </Link>
                      </div>
                      <div
                        className={`transition-max-height overflow-hidden duration-300 ease-in-out ${expandedIndices.includes(index) ? 'max-h-screen' : 'max-h-0'}`}
                      >
                        {expandedIndices.includes(index) && (
                          <div className="flex flex-col gap-3 px-24 py-4">
                            <div className="flex items-center">
                              <div className="mr-4 font-semibold">
                                Transaction Type:
                              </div>
                              <div className="flex items-center">
                                {transaction.type}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4 font-semibold">
                                Category:
                              </div>
                              <div className="flex items-center">
                                {editTransactionId ===
                                transaction.transactionId ? (
                                  <select
                                    value={category}
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                    className="rounded border p-1"
                                  >
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Other">Other</option>
                                  </select>
                                ) : (
                                  <>
                                    {transaction.category}
                                    <FontAwesomeIcon
                                      icon="pencil-alt"
                                      className="ml-2 cursor-pointer"
                                      onClick={() =>
                                        handleEdit(
                                          transaction.transactionId,
                                          transaction.category,
                                          transaction.notes
                                        )
                                      }
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4 font-semibold">Notes:</div>
                              <div className="flex items-center">
                                {editTransactionId ===
                                transaction.transactionId ? (
                                  <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded border p-1"
                                  />
                                ) : (
                                  <>
                                    {transaction.notes}
                                    <FontAwesomeIcon
                                      icon="pencil-alt"
                                      className="ml-2 cursor-pointer"
                                      onClick={() =>
                                        handleEdit(
                                          transaction.transactionId,
                                          transaction.category,
                                          transaction.notes
                                        )
                                      }
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                            {editTransactionId ===
                              transaction.transactionId && (
                              <footer className="mt-4 flex justify-end">
                                <button
                                  onClick={() =>
                                    handleSave(transaction.transactionId)
                                  }
                                  className="mr-2 rounded bg-secondary px-4 py-2 text-white transition-colors duration-200 hover:bg-[#00A96B]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="rounded bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </footer>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="flex items-center justify-center p-4">
            <p className="text-lg font-medium text-red-500">
              Account not found.
            </p>
          </div>
        )}
      </>
    </Layout>
  );
};

export default TransactionsPage;
